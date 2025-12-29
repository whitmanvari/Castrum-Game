// src/utils/gameLogic.js

export const PIECES = {
    EMPTY: 0,
    ATTACKER: 1, // Siyah (Saldıran)
    DEFENDER: 2, // Beyaz (Savunan)
    KING: 3      // Kral (Savunan tarafında)
};

// 13x13 Tahtayı Başlatma
export const initializeBoard = () => {
    const board = Array(13).fill(null).map(() => Array(13).fill(PIECES.EMPTY));
    const center = 6;

    // 1. KRAL (Tam Ortaya)
    board[center][center] = PIECES.KING;

    // 2. SAVUNANLAR (Merkezin etrafına)
    const defPositions = [
        [center, center-1], [center, center-2],
        [center, center+1], [center, center+2],
        [center-1, center], [center-2, center],
        [center+1, center], [center+2, center],
        [center-1, center-1], [center-1, center+1],
        [center+1, center-1], [center+1, center+1]
    ];
    defPositions.forEach(pos => board[pos[0]][pos[1]] = PIECES.DEFENDER);

    // 3. SALDIRANLAR (Kenarlara)
    const attPositions = [
        // Üst
        [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 6],
        // Alt
        [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [11, 6],
        // Sol
        [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [6, 1],
        // Sağ
        [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [6, 11]
    ];
    attPositions.forEach(pos => board[pos[0]][pos[1]] = PIECES.ATTACKER);

    return board;
};

// Köşe veya Merkez kontrolü (Sığınaklar)
const isRestrictedArea = (r, c) => {
    // 4 Köşe ve Merkez
    return (r===0 && c===0) || (r===0 && c===12) || (r===12 && c===0) || (r===12 && c===12) || (r===6 && c===6);
};

// Hamle Geçerli mi? (Yol Kontrolü)
export const isValidMove = (board, fromRow, fromCol, toRow, toCol) => {
    // 1. Hedefte başka taş var mı?
    if (board[toRow][toCol] !== PIECES.EMPTY) return false;

    // 2. Sadece Yatay veya Dikey hareket (Çapraz yasak)
    if (fromRow !== toRow && fromCol !== toCol) return false;

    // 3. Arada başka taş var mı? (Taşların üzerinden atlanmaz)
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

    // 4. Kısıtlı Alanlar (Köşeler ve Merkez)
    const movingPiece = board[fromRow][fromCol];
    // Eğer taş Kral DEĞİLSE, köşelere ve merkeze giremez
    if (movingPiece !== PIECES.KING && isRestrictedArea(toRow, toCol)) {
        return false;
    }

    return true;
};

// Hamle Sonrası Mantık (Taş Yeme & Tahtayı Güncelleme)
export const processMove = (currentBoard, r, c, playerType) => {
    const newBoard = currentBoard.map(row => [...row]); // Tahtanın kopyasını al
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Sağ, Sol, Aşağı, Yukarı
    let captured = false;

    directions.forEach(([dr, dc]) => {
        const r1 = r + dr;     // Komşu (Yenecek olan taşın yeri)
        const r2 = r + (dr*2); // Komşunun arkası (Kıstıran diğer taşın yeri)

        // Tahta sınırları içinde mi?
        if (r2 >= 0 && r2 < 13 && c2 >= 0 && c2 < 13) {
            const neighbor = newBoard[r1][c1];
            const farNeighbor = newBoard[r2][c2];

            // Ben kime saldırıyorum?
            const isMeAttacker = playerType === PIECES.ATTACKER;
            
            // Düşman kim?
            const isNeighborEnemy = isMeAttacker 
                ? (neighbor === PIECES.DEFENDER) // Saldıran sadece askeri yer (Kral özel kuraldır, şimdilik basit tutalım)
                : (neighbor === PIECES.ATTACKER);

            if (isNeighborEnemy) {
                // Arkadaki taş benim dostum mu? Veya Köşe mi? (Köşeler dost sayılır)
                // Dost tanımı: Benim taşım, Kral (eğer ben savunansam) veya Köşeler
                let isFarFriendly = false;

                if (isMeAttacker) {
                    isFarFriendly = (farNeighbor === PIECES.ATTACKER) || isRestrictedArea(r2, c2);
                } else {
                    isFarFriendly = (farNeighbor === PIECES.DEFENDER) || (farNeighbor === PIECES.KING) || isRestrictedArea(r2, c2);
                }

                if (isFarFriendly) {
                    newBoard[r1][c1] = PIECES.EMPTY; // TAŞI YE!
                    captured = true;
                }
            }
        }
    });

    return { board: newBoard, captured };
};

// Kral Kazandı mı?
export const checkWin = (board) => {
    // 4 Köşe
    const corners = [[0,0], [0,12], [12,0], [12,12]];
    // Kral köşelerden birindeyse kazanır
    return corners.some(([r, c]) => board[r][c] === PIECES.KING);
};