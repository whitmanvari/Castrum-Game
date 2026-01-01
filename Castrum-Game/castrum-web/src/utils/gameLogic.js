export const PIECES = {
    EMPTY: 0,
    ATTACKER: 1, // Siyah
    DEFENDER: 2, // Beyaz
    KING: 3      // Kral
};

// 11x11 TAHTA KURULUMU
export const initializeBoard = () => {
    const board = Array(11).fill(null).map(() => Array(11).fill(PIECES.EMPTY));
    const center = 5; // 0'dan başladığı için 11'in ortası 5'tir

    // 1. KRAL 
    board[center][center] = PIECES.KING;

    // 2. SAVUNANLAR (Beyaz - 12 Asker + 1 Kral)
    // Merkezin etrafında elmas/artı şekli
    const defPositions = [
        [center, center - 1], [center, center - 2],
        [center, center + 1], [center, center + 2],
        [center - 1, center], [center - 2, center],
        [center + 1, center], [center + 2, center],
        [center - 1, center - 1], [center - 1, center + 1],
        [center + 1, center - 1], [center + 1, center + 1]
    ];

    // Savunanları yerleştir
    defPositions.forEach(pos => {
        if (pos[0] >= 0 && pos[0] < 11 && pos[1] >= 0 && pos[1] < 11) {
            board[pos[0]][pos[1]] = PIECES.DEFENDER;
        }
    });

    // 3. SALDIRANLAR (Siyah - 24 Asker)
    // Her kenarın ortasına T şeklinde yerleşim
    const attPositions = [
        // Üst Kenar
        [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 5],
        // Alt Kenar
        [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [9, 5],
        // Sol Kenar
        [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [5, 1],
        // Sağ Kenar
        [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [5, 9]
    ];

    attPositions.forEach(pos => {
        if (pos[0] >= 0 && pos[0] < 11 && pos[1] >= 0 && pos[1] < 11) {
            board[pos[0]][pos[1]] = PIECES.ATTACKER;
        }
    });

    return board;
};

// Hamle Geçerli mi?
export const isValidMove = (board, fromRow, fromCol, toRow, toCol) => {
    // Sınır Kontrolü 
    if (toRow < 0 || toRow >= 11 || toCol < 0 || toCol >= 11) return false;

    if (board[toRow][toCol] !== PIECES.EMPTY) return false;
    if (fromRow !== toRow && fromCol !== toCol) return false;

    const movingPiece = board[fromRow][fromCol];
    const distance = Math.abs(toRow - fromRow) + Math.abs(toCol - fromCol);

    // KURAL: Eğer taş KRAL DEĞİLSE, 2 kareden fazla gidemez!
    if (movingPiece !== PIECES.KING && distance > 2) {
        return false;
    }

    // Yol Kontrolü
    if (fromRow === toRow) { // Yatay
        const min = Math.min(fromCol, toCol);
        const max = Math.max(fromCol, toCol);
        for (let i = min + 1; i < max; i++) {
            if (board[fromRow][i] !== PIECES.EMPTY) return false;
        }
    } else { // Dikey
        const min = Math.min(fromRow, toRow);
        const max = Math.max(fromRow, toRow);
        for (let i = min + 1; i < max; i++) {
            if (board[i][fromCol] !== PIECES.EMPTY) return false;
        }
    }

    // Yasaklı Bölgeler 
    const isRestricted = (r, c) => {
        const corners = [[0,0], [0,10], [10,0], [10,10], [5,5]];
        return corners.some(([cr, cc]) => cr === r && cc === c);
    };

    if (movingPiece !== PIECES.KING && isRestricted(toRow, toCol)) {
        return false;
    }

    return true;
};

// Taş Yeme
export const processMove = (board, r, c, playerType) => {
    const newBoard = board.map(row => [...row]);
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    let captured = false;

    directions.forEach(([dr, dc]) => {
        const r1 = r + dr;
        const c1 = c + dc;

        const r2 = r + (dr * 2);
        const c2 = c + (dc * 2);

        if (r2 >= 0 && r2 < 11 && c2 >= 0 && c2 < 11) {
            const neighbor = newBoard[r1][c1];
            const farNeighbor = newBoard[r2][c2];

            const isMeAttacker = playerType === PIECES.ATTACKER;
            const isNeighborEnemy = isMeAttacker
                ? (neighbor === PIECES.DEFENDER)
                : (neighbor === PIECES.ATTACKER);

            if (isNeighborEnemy) {
                // Köşe ve Merkez kontrolü
                const isCorner = (row, col) => (row === 0 && col === 0) || (row === 0 && col === 10) || (row === 10 && col === 0) || (row === 10 && col === 10) || (row === 5 && col === 5);

                const isFarFriendly = isMeAttacker
                    ? (farNeighbor === PIECES.ATTACKER || isCorner(r2, c2))
                    : (farNeighbor === PIECES.DEFENDER || farNeighbor === PIECES.KING || isCorner(r2, c2));

                if (isFarFriendly) {
                    newBoard[r1][c1] = PIECES.EMPTY;
                    captured = true;
                }
            }
        }
    });

    return { board: newBoard, captured };
};

// Kazanma Kontrolü 
export const checkWin = (board) => {
    const corners = [[0, 0], [0, 10], [10, 0], [10, 10]];
    return corners.some(([r, c]) => board[r][c] === PIECES.KING);
};

// Kral Esir Alındı mı? 
export const checkKingCaptured = (board) => {
    let kingPos = null;
    for (let r = 0; r < 11; r++) {
        for (let c = 0; c < 11; c++) {
            if (board[r][c] === PIECES.KING) {
                kingPos = { r, c };
                break;
            }
        }
        if (kingPos) break;
    }

    if (!kingPos) return true;

    const { r, c } = kingPos;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    const isSurrounded = directions.every(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;

        if (nr < 0 || nr >= 11 || nc < 0 || nc >= 11) return false; // Kenarda yakalanamaz

        const neighborPiece = board[nr][nc];
        const isRestrictedSquare = (nr === 0 && nc === 0) || (nr === 0 && nc === 10) || (nr === 10 && nc === 0) || (nr === 10 && nc === 10) || (nr === 5 && nc === 5);
        const isHostile = (neighborPiece === PIECES.ATTACKER) || isRestrictedSquare;

        return isHostile;
    });

    return isSurrounded;
};