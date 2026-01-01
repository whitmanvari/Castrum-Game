// src/utils/gameLogic.js

// Taş Tipleri
export const PIECES = {
    EMPTY: 0,
    ATTACKER: 1, // Siyah
    DEFENDER: 2, // Beyaz
    KING: 3      // Kral
};

// Tahtayı Başlatma
export const initializeBoard = () => {
    const board = Array(13).fill(null).map(() => Array(13).fill(PIECES.EMPTY));
    const center = 6;

    // 1. KRAL
    board[center][center] = PIECES.KING;

    // 2. SAVUNANLAR
    const defPositions = [
        [center, center-1], [center, center-2], [center, center+1], [center, center+2],
        [center-1, center], [center-2, center], [center+1, center], [center+2, center],
        [center-1, center-1], [center-1, center+1], [center+1, center-1], [center+1, center+1]
    ];
    defPositions.forEach(pos => board[pos[0]][pos[1]] = PIECES.DEFENDER);

    // 3. SALDIRANLAR
    const attPositions = [
        [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 6],
        [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [11, 6],
        [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [6, 1],
        [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [6, 11]
    ];
    attPositions.forEach(pos => board[pos[0]][pos[1]] = PIECES.ATTACKER);

    return board;
};

// Hamle Geçerli mi?
export const isValidMove = (board, fromRow, fromCol, toRow, toCol) => {
    if (board[toRow][toCol] !== PIECES.EMPTY) return false;
    if (fromRow !== toRow && fromCol !== toCol) return false;

    // Yol Kontrolü
    if (fromRow === toRow) { // Yatay
        const min = Math.min(fromCol, toCol);
        const max = Math.max(fromCol, toCol);
        for (let i = min + 1; i < max; i++) {
            if (board[fromRow][i] !== PIECES.EMPTY) return false;
        }
    } else if (fromCol === toCol) { // Dikey
        const min = Math.min(fromRow, toRow);
        const max = Math.max(fromRow, toRow);
        for (let i = min + 1; i < max; i++) {
            if (board[i][fromCol] !== PIECES.EMPTY) return false;
        }
    }

    // Yasaklı Bölge (Köşeler ve Merkez) - Sadece Kral Girebilir
    const isRestricted = (r, c) => {
        const corners = [[0,0], [0,12], [12,0], [12,12], [6,6]];
        return corners.some(([cr, cc]) => cr === r && cc === c);
    };

    const movingPiece = board[fromRow][fromCol];
    if (movingPiece !== PIECES.KING && isRestricted(toRow, toCol)) {
        return false;
    }

    return true;
};

// Taş Yeme ve Sonuç Mantığı
export const processMove = (board, r, c, playerType) => {
    const newBoard = board.map(row => [...row]); 
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Sağ, Sol, Aşağı, Yukarı
    let captured = false;

    directions.forEach(([dr, dc]) => {
        const r1 = r + dr;      
        const c1 = c + dc;      
        
        const r2 = r + (dr * 2); 
        const c2 = c + (dc * 2); 

        // Tahta sınırları içinde mi?
        if (r2 >= 0 && r2 < 13 && c2 >= 0 && c2 < 13) {
            const neighbor = newBoard[r1][c1];
            const farNeighbor = newBoard[r2][c2];

            // Düşman taşı belirle
            const isMeAttacker = playerType === PIECES.ATTACKER;
            const isNeighborEnemy = isMeAttacker 
                ? (neighbor === PIECES.DEFENDER) 
                : (neighbor === PIECES.ATTACKER);

            if (isNeighborEnemy) {
                // Köşe kontrolü için yardımcı fonksiyon
                const isCorner = (row, col) => (row===0 && col===0) || (row===0 && col===12) || (row===12 && col===0) || (row===12 && col===12) || (row===6 && col===6);

                // Arkasındaki taş dost mu veya köşe mi?
                const isFarFriendly = isMeAttacker 
                    ? (farNeighbor === PIECES.ATTACKER || isCorner(r2, c2))
                    : (farNeighbor === PIECES.DEFENDER || farNeighbor === PIECES.KING || isCorner(r2, c2));

                if (isFarFriendly) {
                    newBoard[r1][c1] = PIECES.EMPTY; // TAŞI YE!
                    captured = true;
                }
            }
        }
    });

    return { board: newBoard, captured };
};

// Kazanma Kontrolü (Kral Kaçtı mı?)
export const checkWin = (board) => {
    const corners = [[0,0], [0,12], [12,0], [12,12]];
    return corners.some(([r, c]) => board[r][c] === PIECES.KING);
};