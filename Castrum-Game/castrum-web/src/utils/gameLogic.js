// src/utils/gameLogic.js

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
        [center, center - 1], [center, center - 2], [center, center + 1], [center, center + 2],
        [center - 1, center], [center - 2, center], [center + 1, center], [center + 2, center],
        [center - 1, center - 1], [center - 1, center + 1], [center + 1, center - 1], [center + 1, center + 1]
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
    // 1. Hedefte başka taş var mı? (Doluya gidemez)
    if (board[toRow][toCol] !== PIECES.EMPTY) return false;

    // 2. Sadece Yatay veya Dikey hareket (Çapraz yasak)
    if (fromRow !== toRow && fromCol !== toCol) return false;

    // --- YENİ KURAL: MESAFE KONTROLÜ ---
    const movingPiece = board[fromRow][fromCol];

    // Gidilen mesafe hesabı (Mutlak değer)
    const distance = Math.abs(toRow - fromRow) + Math.abs(toCol - fromCol);

    // KURAL: Eğer taş KRAL DEĞİLSE, 2 kareden fazla gidemez!
    if (movingPiece !== PIECES.KING && distance > 2) {
        return false;
    }
    // ----------------------------------

    // 3. Yol Üzerinde Engel Var mı? (Atlama Yapamaz)
    if (fromRow === toRow) { // Yatay Hareket
        const min = Math.min(fromCol, toCol);
        const max = Math.max(fromCol, toCol);
        for (let i = min + 1; i < max; i++) {
            if (board[fromRow][i] !== PIECES.EMPTY) return false;
        }
    } else { // Dikey Hareket
        const min = Math.min(fromRow, toRow);
        const max = Math.max(fromRow, toRow);
        for (let i = min + 1; i < max; i++) {
            if (board[i][fromCol] !== PIECES.EMPTY) return false;
        }
    }

    // 4. Yasaklı Bölgeler (Köşeler ve Merkez)
    // Kural: Köşelere ve Merkeze SADECE Kral girebilir.
    const isRestricted = (r, c) => {
        const corners = [[0, 0], [0, 12], [12, 0], [12, 12], [6, 6]];
        return corners.some(([cr, cc]) => cr === r && cc === c);
    };

    // Eğer taş KRAL DEĞİLSE ve hedef yasaklı bölge ise -> YASAK
    if (movingPiece !== PIECES.KING && isRestricted(toRow, toCol)) {
        return false;
    }

    return true;
};

// Taş Yeme Mantığı
export const processMove = (board, r, c, playerType) => {
    const newBoard = board.map(row => [...row]);
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Sağ, Sol, Aşağı, Yukarı
    let captured = false;

    directions.forEach(([dr, dc]) => {
        const r1 = r + dr;
        const c1 = c + dc;

        const r2 = r + (dr * 2);
        const c2 = c + (dc * 2);

        if (r2 >= 0 && r2 < 13 && c2 >= 0 && c2 < 13) {
            const neighbor = newBoard[r1][c1];
            const farNeighbor = newBoard[r2][c2];

            const isMeAttacker = playerType === PIECES.ATTACKER;
            const isNeighborEnemy = isMeAttacker
                ? (neighbor === PIECES.DEFENDER)
                : (neighbor === PIECES.ATTACKER);

            if (isNeighborEnemy) {
                const isCorner = (row, col) => (row === 0 && col === 0) || (row === 0 && col === 12) || (row === 12 && col === 0) || (row === 12 && col === 12) || (row === 6 && col === 6);

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

// --- KAZANMA KONTROLLERİ ---

// 1. SAVUNAN KAZANIR (Kral Kaçtı mı?)
export const checkWin = (board) => {
    const corners = [[0, 0], [0, 12], [12, 0], [12, 12]];
    return corners.some(([r, c]) => board[r][c] === PIECES.KING);
};

// 2. SALDIRAN KAZANIR (Kral Esir Alındı mı?) -> YENİ EKLENDİ!
export const checkKingCaptured = (board) => {
    // Önce Kralı Bul
    let kingPos = null;
    for (let r = 0; r < 13; r++) {
        for (let c = 0; c < 13; c++) {
            if (board[r][c] === PIECES.KING) {
                kingPos = { r, c };
                break;
            }
        }
        if (kingPos) break;
    }

    if (!kingPos) return true; // Kral tahtada yoksa (hata veya yenmiş) kazanılmış sayılır.

    const { r, c } = kingPos;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Sağ, Sol, Aşağı, Yukarı

    // Kralın 4 tarafı da "Düşman" veya "Yasak Bölge" mi?
    const isSurrounded = directions.every(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;

        // Tahta dışı (Kenarlar) genelde kuşatma sayılmaz, Kral kenara kaçarsa sıkıştırılamaz.
        // O yüzden kenardaysa FALSE döneriz, yani yakalanamaz.
        if (nr < 0 || nr >= 13 || nc < 0 || nc >= 13) return false;

        const neighborPiece = board[nr][nc];

        // Tehlikeli Kareler: Köşeler ve Merkez (Eğer Kral içinde değilse)
        const isRestrictedSquare = (nr === 0 && nc === 0) || (nr === 0 && nc === 12) || (nr === 12 && nc === 0) || (nr === 12 && nc === 12) || (nr === 6 && nc === 6);

        // Kuşatıcı Unsur: Siyah Asker (ATTACKER) veya Yasaklı Bölge
        const isHostile = (neighborPiece === PIECES.ATTACKER) || isRestrictedSquare;

        return isHostile;
    });

    return isSurrounded;
};