// ========================================
// シミュレーション（試合処理）修正版
// ========================================
function startSimulation() {
    showScreen('simulationScreen');
    simulateSeason();
}

function simulateSeason() {
    const TOTAL_GAMES = 143;
    let gameCount = 0;
    const logContainer = document.getElementById('simulationLog');
    logContainer.innerHTML = '';

    gameState.teams.forEach(team => {
        team.results = { wins: 0, losses: 0, runs: 0, runsAllowed: 0 };
    });

    function playGame() {
        if (gameCount >= TOTAL_GAMES) {
            endSimulation();
            return;
        }

        // リーグ内から対戦する2チームをランダム抽選
        const idx1 = Math.floor(Math.random() * gameState.teams.length);
        let idx2 = Math.floor(Math.random() * gameState.teams.length);
        while (idx1 === idx2) {
            idx2 = Math.floor(Math.random() * gameState.teams.length);
        }

        const team1 = gameState.teams[idx1];
        const team2 = gameState.teams[idx2];

        // チームの基本攻撃力（2.0 〜 6.0 程度に収まる設計）
        const attack1 = calculateBaseAttack(team1);
        const attack2 = calculateBaseAttack(team2);

        // チームの守備妨害力（0.0 〜 2.0 程度、優秀な投手ほど相手の得点を減らす）
        const defense1 = calculatePitchingDefense(team1);
        const defense2 = calculatePitchingDefense(team2);

        // 相手の防御力を差し引いたベース得点
        let team1Base = Math.max(0.5, attack1 - defense2);
        let team2Base = Math.max(0.5, attack2 - defense1);

        // ★重要★ 野球のランダム性を出すため、標準的な「ポアソン分布」風の乱数を付与
        // 運の要素を大きくすることで、実力差があっても負けるリアルなバランスに
        let team1Score = Math.floor(team1Base + (Math.random() * Math.random() * 8));
        let team2Score = Math.floor(team2Base + (Math.random() * Math.random() * 8));

        // 引き分け防止（同点なら延長戦としてどちらかに1点）
        if (team1Score === team2Score) {
            if (Math.random() > 0.5) team1Score++; else team2Score++;
        }

        // 勝敗判定
        if (team1Score > team2Score) {
            team1.results.wins++;
            team2.results.losses++;
        } else {
            team2.results.wins++;
            team1.results.losses++;
        }

        team1.results.runs += team1Score;
        team1.results.runsAllowed += team2Score;
        team2.results.runs += team2Score;
        team2.results.runsAllowed += team1Score;

        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `第${gameCount + 1}試合: ${team1.name} ${team1Score} - ${team2Score} ${team2.name}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;

        gameCount++;
        const progress = (gameCount / TOTAL_GAMES) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('gameCount').textContent = `${gameCount}試合 / ${TOTAL_GAMES}試合`;

        setTimeout(playGame, 20); // テンポよく進むよう少し加速
    }

    playGame();
}

// 攻撃力の計算（現実的な1試合の平均得点ベースに圧縮）
function calculateBaseAttack(team) {
    let attackPower = 0;
    let batterCount = 0;

    team.roster.forEach(player => {
        if (player.position !== '投手' && player.stats) {
            // 打率、本塁打、盗塁の合計貢献度を1人の平均値に丸める
            const avgContribution = player.stats.battingAverage * 5; // 例: .300 → 1.5
            const hrContribution = player.stats.homeRuns * 0.04;    // 例: 30本 → 1.2
            const sbContribution = player.stats.stolenBases * 0.01;  // 例: 20盗塁 → 0.2
            attackPower += (avgContribution + hrContribution + sbContribution);
            batterCount++;
        }
    });

    // 野手が揃っている場合の基準点は3.5点、メンバーが足りないペナルティも考慮
    if (batterCount === 0) return 1.5;
    const teamAverage = attackPower / batterCount;
    return teamAverage * 2.0; 
}

// 防御力の計算（投手の防御率に基づき、相手の得点を何点抑え込めるか）
function calculatePitchingDefense(team) {
    let bestEra = 5.00; // 投手がいない場合のリーグ平均以下の防御率
    let hasPitcher = false;

    team.roster.forEach(player => {
        if (player.position === '投手' && player.stats) {
            if (player.stats.era < bestEra) {
                bestEra = player.stats.era; // チームのエース投手の防御率を採用
            }
            hasPitcher = true;
        }
    });

    // 防御率3.00の投手なら (5.5 - 3.0) * 0.5 = 1.25点 分、相手の打線を抑え込む
    return Math.max(0, (5.50 - bestEra) * 0.5);
}