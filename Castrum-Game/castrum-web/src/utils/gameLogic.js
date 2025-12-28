// Taş Tipleri ve Başlangıç Tahtası
export const PIECES = {
    EMPTY: 0,
    ATTACKER: 1, // Saldıran (Siyah)
    DEFENDER: 2, // Savunan (Beyaz)
    KING: 3      // Kral (Kırmızı/Altın)
};

export const initializeBoard = () => {
    // 13x13'lük boş tahta oluştur (0 ile doldur)
    const board = Array(13).fill(null).map(() => Array(13).fill(PIECES.EMPTY));

    const center = 6; // 13 karede orta nokta (0-12 arası)

    // 1. KRAL (Tam Ortaya)
    board[center][center] = PIECES.KING;

    // 2. SAVUNANLAR 
    // Merkezin hemen sağı, solu, yukarısı, aşağısı
    const defPositions = [
        [center, center-1], [center, center-2], // Sol
        [center, center+1], [center, center+2], // Sağ
        [center-1, center], [center-2, center], // Yukarı
        [center+1, center], [center+2, center]  // Aşağı
        // Köşelere destek 
    ];
    // Savunanları yerleştir
    defPositions.forEach(pos => {
        board[pos[0]][pos[1]] = PIECES.DEFENDER;
    });

    // 3. SALDIRANLAR (Dört kenarın ortalarına T şeklinde)
    // 13x13 için saldırı grupları genelde 6'şar taştan oluşur.
    const attPositions = [
        // Üst Kenar
        [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 6],
        // Alt Kenar
        [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [11, 6],
        // Sol Kenar
        [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [6, 1],
        // Sağ Kenar
        [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [6, 11]
    ];

    attPositions.forEach(pos => {
        board[pos[0]][pos[1]] = PIECES.ATTACKER;
    });

    return board;
};