// ========================================
// 選手データベース（コードで直接定義）
// ========================================
const PLAYERS_DATABASE = [
    // 野手グループ
    {
        id: 1,
        name: '太郎',
        position: '一塁手',
        stats: {
            battingAverage: 0.310,
            homeRuns: 32,
            stolenBases: 8
        }
    },
    {
        id: 2,
        name: '花子',
        position: '中堅手',
        stats: {
            battingAverage: 0.295,
            homeRuns: 18,
            stolenBases: 15
        }
    },
    {
        id: 3,
        name: '次郎',
        position: '遊撃手',
        stats: {
            battingAverage: 0.285,
            homeRuns: 12,
            stolenBases: 22
        }
    },
    {
        id: 4,
        name: '三郎',
        position: '三塁手',
        stats: {
            battingAverage: 0.305,
            homeRuns: 28,
            stolenBases: 5
        }
    },
    {
        id: 5,
        name: '四郎',
        position: '捕手',
        stats: {
            battingAverage: 0.270,
            homeRuns: 15,
            stolenBases: 3
        }
    },
    {
        id: 6,
        name: 'ユキ',
        position: '左翼手',
        stats: {
            battingAverage: 0.320,
            homeRuns: 25,
            stolenBases: 12
        }
    },
    {
        id: 7,
        name: 'ハナ',
        position: '右翼手',
        stats: {
            battingAverage: 0.275,
            homeRuns: 20,
            stolenBases: 10
        }
    },
    {
        id: 8,
        name: 'タケシ',
        position: '二塁手',
        stats: {
            battingAverage: 0.290,
            homeRuns: 8,
            stolenBases: 18
        }
    },
    // 投手グループ
    {
        id: 101,
        name: 'エース太郎',
        position: '投手',
        stats: {
            era: 2.85,
            strikeouts: 10.2,
            inningsPitched: 220
        }
    },
    {
        id: 102,
        name: 'キャプテン',
        position: '投手',
        stats: {
            era: 3.20,
            strikeouts: 9.5,
            inningsPitched: 210
        }
    },
    {
        id: 103,
        name: 'サイドアーム',
        position: '投手',
        stats: {
            era: 3.45,
            strikeouts: 8.8,
            inningsPitched: 195
        }
    },
    {
        id: 104,
        name: 'フォーシーム',
        position: '投手',
        stats: {
            era: 3.65,
            strikeouts: 8.2,
            inningsPitched: 180
        }
    },
    {
        id: 105,
        name: 'ジャイロボール',
        position: '投手',
        stats: {
            era: 3.90,
            strikeouts: 7.9,
            inningsPitched: 165
        }
    },
    {
        id: 106,
        name: '豪速球',
        position: '投手',
        stats: {
            era: 4.10,
            strikeouts: 7.5,
            inningsPitched: 155
        }
    },
    {
        id: 107,
        name: 'カーブマスター',
        position: '投手',
        stats: {
            era: 4.35,
            strikeouts: 7.2,
            inningsPitched: 145
        }
    },
    {
        id: 108,
        name: 'リリーフ王',
        position: '投手',
        stats: {
            era: 3.15,
            strikeouts: 11.0,
            inningsPitched: 90
        }
    }
];

// ========================================
// ゲーム状態管理
// ========================================
const gameState = {
    players: [],
    teams: [],
    currentTurnIndex: 0,
    gameMode: null, // 'offline' or 'online'
    currentPlayerIndex: 0,
    draftComplete: false
};

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    gameState.players = JSON.parse(JSON.stringify(PLAYERS_DATABASE));
    updateNewPlayerStatsDisplay();
});

// ========================================
// 画面管理
// ========================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function backToMenu() {
    showScreen('menuScreen');
}

function showPlayerManagement() {
    showScreen('playerManagement');
    renderPlayersList();
}

function showModeSelection() {
    showScreen('modeSelection');
}

function backToModeSelection() {
    showScreen('modeSelection');
}

// ========================================
// 新規選手作成
// ========================================

function showCreatePlayerModal() {
    clearCreatePlayerForm();
    updateNewPlayerStatsDisplay();
    document.getElementById('createPlayerModal').style.display = 'block';
}

function closeCreatePlayerModal() {
    document.getElementById('createPlayerModal').style.display = 'none';
    clearCreatePlayerForm();
}

function clearCreatePlayerForm() {
    document.getElementById('newPlayerName').value = '';
    document.getElementById('newPlayerPosition').value = '投手';
    document.getElementById('newBattingAverage').value = '';
    document.getElementById('newHomeRuns').value = '';
    document.getElementById('newStolenBases').value = '';
    document.getElementById('newEra').value = '';
    document.getElementById('newStrikeouts').value = '';
    document.getElementById('newInningsPitched').value = '';
}

function updateNewPlayerStatsDisplay() {
    const position = document.getElementById('newPlayerPosition').value;
    const batterStats = document.getElementById('newBatterStats');
    const pitcherStats = document.getElementById('newPitcherStats');

    if (position === '投手') {
        batterStats.style.display = 'none';
        pitcherStats.style.display = 'block';
    } else {
        batterStats.style.display = 'block';
        pitcherStats.style.display = 'none';
    }
}

function createNewPlayer() {
    const name = document.getElementById('newPlayerName').value.trim();
    const position = document.getElementById('newPlayerPosition').value;

    if (!name) {
        alert('選手名を入力してください');
        return;
    }

    // 重複チェック
    if (gameState.players.some(p => p.name === name)) {
        alert('この名前の選手は既に登録されています');
        return;
    }

    // 新しいIDを生成
    const newId = Math.max(...gameState.players.map(p => p.id || 0)) + 1;

    let playerData = {
        id: newId,
        name: name,
        position: position
    };

    if (position === '投手') {
        const era = parseFloat(document.getElementById('newEra').value);
        const strikeouts = parseFloat(document.getElementById('newStrikeouts').value);
        const inningsPitched = parseFloat(document.getElementById('newInningsPitched').value);

        if (isNaN(era) || isNaN(strikeouts) || isNaN(inningsPitched)) {
            alert('投手成績をすべて入力してください');
            return;
        }

        playerData.stats = {
            era: era,
            strikeouts: strikeouts,
            inningsPitched: inningsPitched
        };
    } else {
        const battingAverage = parseFloat(document.getElementById('newBattingAverage').value);
        const homeRuns = parseInt(document.getElementById('newHomeRuns').value);
        const stolenBases = parseInt(document.getElementById('newStolenBases').value);

        if (isNaN(battingAverage) || isNaN(homeRuns) || isNaN(stolenBases)) {
            alert('野手成績をすべて入力してください');
            return;
        }

        playerData.stats = {
            battingAverage: battingAverage,
            homeRuns: homeRuns,
            stolenBases: stolenBases
        };
    }

    gameState.players.push(playerData);
    closeCreatePlayerModal();
    renderPlayersList();
    alert(`${name}を作成しました！`);
}

// ========================================
// 選手管理システム
// ========================================

// 選手一覧を表示
function renderPlayersList() {
    const container = document.getElementById('playersList');
    document.getElementById('playerCount').textContent = gameState.players.length;

    if (gameState.players.length === 0) {
        container.innerHTML = '<p class="empty-message">選手がまだ登録されていません</p>';
        return;
    }

    container.innerHTML = gameState.players.map(player => {
        let statsHtml = '';
        if (player.position === '投手') {
            statsHtml = `
                防御率: ${player.stats.era.toFixed(2)} | 
                奪三振率: ${player.stats.strikeouts.toFixed(1)} | 
                投球回数: ${player.stats.inningsPitched.toFixed(1)}
            `;
        } else {
            statsHtml = `
                打率: ${player.stats.battingAverage.toFixed(3)} | 
                本塁打: ${player.stats.homeRuns} | 
                盗塁: ${player.stats.stolenBases}
            `;
        }

        return `
            <div class="player-item">
                <div class="player-info">
                    <span class="player-name">${player.name}</span>
                    <span class="player-position">${player.position}</span>
                </div>
                <div class="player-stats">${statsHtml}</div>
                <button class="btn btn-edit" onclick="editPlayer(${player.id})">編集</button>
            </div>
        `;
    }).join('');
}

// プレイヤーを編集（モーダルで表示）
function editPlayer(playerId) {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    // 編集フォームに値をセット
    document.getElementById('editPlayerName').value = player.name;
    document.getElementById('editPlayerPosition').value = player.position;

    if (player.position === '投手') {
        document.getElementById('editEra').value = player.stats.era;
        document.getElementById('editStrikeouts').value = player.stats.strikeouts;
        document.getElementById('editInningsPitched').value = player.stats.inningsPitched;
    } else {
        document.getElementById('editBattingAverage').value = player.stats.battingAverage;
        document.getElementById('editHomeRuns').value = player.stats.homeRuns;
        document.getElementById('editStolenBases').value = player.stats.stolenBases;
    }

    // グローバル変数で編集中のプレイヤーIDを保存
    window.editingPlayerId = playerId;
    showEditModal(player.position);
}

// 編集モーダルを表示
function showEditModal(position) {
    const modal = document.getElementById('editModal');
    const batterStats = document.getElementById('editBatterStats');
    const pitcherStats = document.getElementById('editPitcherStats');

    if (position === '投手') {
        batterStats.style.display = 'none';
        pitcherStats.style.display = 'block';
    } else {
        batterStats.style.display = 'block';
        pitcherStats.style.display = 'none';
    }

    modal.style.display = 'block';
}

// 編集モーダルを閉じる
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// 選手を保存
function saveEditedPlayer() {
    const player = gameState.players.find(p => p.id === window.editingPlayerId);
    if (!player) return;

    const position = document.getElementById('editPlayerPosition').value;

    if (position === '投手') {
        const era = parseFloat(document.getElementById('editEra').value);
        const strikeouts = parseFloat(document.getElementById('editStrikeouts').value);
        const inningsPitched = parseFloat(document.getElementById('editInningsPitched').value);

        if (isNaN(era) || isNaN(strikeouts) || isNaN(inningsPitched)) {
            alert('投手成績をすべて入力してください');
            return;
        }

        player.stats = {
            era: era,
            strikeouts: strikeouts,
            inningsPitched: inningsPitched
        };
    } else {
        const battingAverage = parseFloat(document.getElementById('editBattingAverage').value);
        const homeRuns = parseInt(document.getElementById('editHomeRuns').value);
        const stolenBases = parseInt(document.getElementById('editStolenBases').value);

        if (isNaN(battingAverage) || isNaN(homeRuns) || isNaN(stolenBases)) {
            alert('野手成績をすべて入力してください');
            return;
        }

        player.stats = {
            battingAverage: battingAverage,
            homeRuns: homeRuns,
            stolenBases: stolenBases
        };
    }

    closeEditModal();
    renderPlayersList();
    alert('選手情報を更新しました！');
}

// 選手を削除
function deleteEditingPlayer() {
    if (confirm('この選手を削除しますか？')) {
        gameState.players = gameState.players.filter(p => p.id !== window.editingPlayerId);
        closeEditModal();
        renderPlayersList();
        alert('選手を削除しました！');
    }
}

// ========================================
// ゲーム開始
// ========================================

function startOfflineMode() {
    if (gameState.players.length < 2) {
        alert('ゲームを開始するには最低2人以上の選手が必要です');
        return;
    }

    gameState.gameMode = 'offline';
    initializeDraft(2); // CPU1対プレイヤー1
    showScreen('draftScreen');
}

function showOnlineSetup() {
    showScreen('onlineSetup');
}

function showCreateRoom() {
    showScreen('createRoom');
}

function showJoinRoom() {
    showScreen('joinRoom');
}

function createRoom() {
    const playerName = document.getElementById('playerName1').value.trim();
    const playerCount = parseInt(document.getElementById('playerCount').value);

    if (!playerName) {
        alert('プレイヤー名を入力してください');
        return;
    }

    if (gameState.players.length < playerCount * 9) {
        alert(`${playerCount}人で遊ぶには最低${playerCount * 9}人以上の選手が必要です`);
        return;
    }

    // 合言葉を生成
    const roomCode = generateRoomCode();
    alert(`ルームコード: ${roomCode}\n他のプレイヤーにこのコードを伝えてください`);

    gameState.gameMode = 'online';
    gameState.roomCode = roomCode;
    gameState.playerCount = playerCount;
    gameState.playerName = playerName;

    initializeDraft(playerCount);
    showScreen('draftScreen');
}

function joinRoom() {
    const playerName = document.getElementById('playerName2').value.trim();
    const roomCode = document.getElementById('roomCode').value.trim().toUpperCase();

    if (!playerName) {
        alert('プレイヤー名を入力してください');
        return;
    }

    if (roomCode.length !== 4) {
        alert('正しい合言葉を入力してください');
        return;
    }

    // 実装では実際のサーバー通信が必要
    alert(`${roomCode}のルームに参加します`);
    
    gameState.gameMode = 'online';
    gameState.roomCode = roomCode;
    gameState.playerName = playerName;

    initializeDraft(2); // 簡略化のため2人で開始
    showScreen('draftScreen');
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ========================================
// ドラフト初期化
// ========================================

function initializeDraft(teamCount) {
    gameState.teams = [];
    gameState.currentTurnIndex = 0;
    gameState.draftComplete = false;

    for (let i = 0; i < teamCount; i++) {
        gameState.teams.push({
            id: i,
            name: i === 0 ? gameState.playerName || 'プレイヤー' : `CPU${i}`,
            roster: [],
            isAI: i !== 0 && gameState.gameMode === 'offline'
        });
    }

    // 選手をシャッフル
    const shuffledPlayers = [...gameState.players].sort(() => Math.random() - 0.5);
    gameState.availablePlayers = shuffledPlayers.map(p => ({...p}));

    updateDraftDisplay();
}

// ========================================
// ドラフト画面更新
// ========================================

function updateDraftDisplay() {
    const currentTeam = gameState.teams[gameState.currentTurnIndex % gameState.teams.length];
    const round = Math.floor(gameState.currentTurnIndex / gameState.teams.length) + 1;

    document.getElementById('currentRound').textContent = `第${round}巡`;
    document.getElementById('currentTurn').textContent = currentTeam.name;

    // 利用可能な選手を表示
    const availableList = document.getElementById('availablePlayersList');
    if (gameState.availablePlayers.length === 0) {
        availableList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">ドラフト終了</p>';
    } else {
        availableList.innerHTML = gameState.availablePlayers.map(player => `
            <div class="player-card" onclick="selectPlayer(${player.id})">
                <div class="player-card-name">${player.name}</div>
                <div class="player-card-position">${player.position}</div>
            </div>
        `).join('');
    }

    // 自分のチームを表示
    const myTeam = document.getElementById('myTeam');
    if (currentTeam.roster.length === 0) {
        myTeam.innerHTML = '<p style="color: #999;">選手がまだいません</p>';
    } else {
        myTeam.innerHTML = currentTeam.roster.map(player => `
            <div class="team-player">
                <div class="team-player-name">${player.name}</div>
                <div class="team-player-position">${player.position}</div>
            </div>
        `).join('');
    }

    // 他のチームを表示
    const otherTeamsDiv = document.getElementById('otherTeams');
    const otherTeams = gameState.teams.filter((t, idx) => idx !== gameState.currentTurnIndex % gameState.teams.length);
    otherTeamsDiv.innerHTML = otherTeams.map(team => `
        <div class="other-team">
            <div class="other-team-name">${team.name} (${team.roster.length}人)</div>
            <div style="font-size: 0.85em; color: #999;">
                ${team.roster.map(p => p.name).join(', ') || '選手未登録'}
            </div>
        </div>
    `).join('');

    // アクションボタン
    const actionDiv = document.getElementById('draftAction');
    const isCurrentPlayer = currentTeam.id === 0;

    if (gameState.availablePlayers.length === 0) {
        actionDiv.innerHTML = '<button class="btn btn-primary" onclick="startSimulation()">シミュレーション開始</button>';
    } else if (isCurrentPlayer) {
        actionDiv.innerHTML = '<p style="color: #666; margin: 0;">選手をクリックして選択してください</p>';
    } else {
        actionDiv.innerHTML = '<p style="color: #666; margin: 0;">CPUが選手を選択中...</p>';
        setTimeout(cpuSelectPlayer, 1500);
    }
}

function selectPlayer(playerId) {
    const player = gameState.availablePlayers.find(p => p.id === playerId);
    if (!player) return;

    const currentTeam = gameState.teams[gameState.currentTurnIndex % gameState.teams.length];
    
    if (currentTeam.id !== 0) {
        alert('現在のターンではありません');
        return;
    }

    currentTeam.roster.push(player);
    gameState.availablePlayers = gameState.availablePlayers.filter(p => p.id !== playerId);
    gameState.currentTurnIndex++;

    updateDraftDisplay();
}

function cpuSelectPlayer() {
    if (gameState.availablePlayers.length === 0) {
        startSimulation();
        return;
    }

    const currentTeam = gameState.teams[gameState.currentTurnIndex % gameState.teams.length];
    const randomPlayer = gameState.availablePlayers[Math.floor(Math.random() * gameState.availablePlayers.length)];

    currentTeam.roster.push(randomPlayer);
    gameState.availablePlayers = gameState.availablePlayers.filter(p => p.id !== randomPlayer.id);
    gameState.currentTurnIndex++;

    updateDraftDisplay();
}

// ========================================
// シミュレーション
// ========================================

function startSimulation() {
    showScreen('simulationScreen');
    simulateSeason();
}

function simulateSeason() {
    const GAMES = 143;
    let gameCount = 0;
    const logContainer = document.getElementById('simulationLog');
    logContainer.innerHTML = '';

    // チームの初期成績を準備
    gameState.teams.forEach(team => {
        team.results = {
            wins: 0,
            losses: 0,
            runs: 0,
            runsAllowed: 0
        };
    });

    function playGame() {
        if (gameCount >= GAMES) {
            endSimulation();
            return;
        }

        // ランダムに2チームを選択
        const team1 = gameState.teams[Math.floor(Math.random() * gameState.teams.length)];
        let team2 = gameState.teams[Math.floor(Math.random() * gameState.teams.length)];
        while (team2.id === team1.id) {
            team2 = gameState.teams[Math.floor(Math.random() * gameState.teams.length)];
        }

        const team1Score = calculateTeamScore(team1);
        const team2Score = calculateTeamScore(team2);

        let log = `${team1.name} ${team1Score} - ${team2Score} ${team2.name}`;

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
        logEntry.textContent = log;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;

        // プログレスバー更新
        gameCount++;
        const progress = (gameCount / GAMES) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('gameCount').textContent = `${gameCount}試合 / ${GAMES}試合`;

        // 次のゲームをスケジュール
        setTimeout(playGame, 50);
    }

    playGame();
}

function calculateTeamScore(team) {
    let score = 0;

    // 野手の成績から得点を計算
    team.roster.forEach(player => {
        if (player.position !== '投手' && player.stats) {
            // 打率と本塁打から得点を推定
            const avgHits = player.stats.battingAverage * 4.5; // 1試合平均打席
            const homeRunContribution = player.stats.homeRuns * 1.5;
            const stolenBaseContribution = player.stats.stolenBases * 0.5;
            score += Math.floor(avgHits + homeRunContribution + stolenBaseContribution);
        }
    });

    // ランダム変動を追加
    score += Math.floor(Math.random() * 10 - 3);
    return Math.max(score, 0);
}

function endSimulation() {
    // チームをポイント順にソート
    gameState.teams.sort((a, b) => b.results.wins - a.results.wins);
    showScreen('resultScreen');
    displayResults();
}

function displayResults() {
    const resultsContainer = document.getElementById('results');

    resultsContainer.innerHTML = gameState.teams.map((team, index) => {
        const winPercentage = ((team.results.wins / (team.results.wins + team.results.losses)) * 100).toFixed(1);
        const avgRuns = (team.results.runs / (team.results.wins + team.results.losses)).toFixed(2);
        const avgAllowed = (team.results.runsAllowed / (team.results.wins + team.results.losses)).toFixed(2);

        return `
            <div class="result-card">
                <div class="result-title">
                    ${index + 1}位: ${team.name}
                </div>
                <div class="result-stats">
                    <div class="stat-item">
                        <div class="stat-label">勝利</div>
                        <div class="stat-value">${team.results.wins}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">敗北</div>
                        <div class="stat-value">${team.results.losses}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">勝率</div>
                        <div class="stat-value">${winPercentage}%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">得点/試合</div>
                        <div class="stat-value">${avgRuns}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">失点/試合</div>
                        <div class="stat-value">${avgAllowed}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">選手数</div>
                        <div class="stat-value">${team.roster.length}</div>
                    </div>
                </div>
                <div style="margin-top: 15px; font-size: 0.9em; color: #666;">
                    <strong>チーム構成:</strong> ${team.roster.map(p => p.name).join(', ')}
                </div>
            </div>
        `;
    }).join('');
}

// モーダルの外側をクリックで閉じる
window.onclick = function(event) {
    const createModal = document.getElementById('createPlayerModal');
    const editModal = document.getElementById('editModal');
    
    if (event.target === createModal) {
        createModal.style.display = 'none';
    }
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
}