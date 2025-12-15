<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// === CONEXÃO ===
$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    echo json_encode([
        'sucesso' => false,
        'erro' => 'Falha na conexão'
    ]);
    exit;
}

try {

    $stmt = $pdo->query("
        SELECT 
            id,
            nome,
            email,
            funcao,
            data_criacao
        FROM usuarios
        ORDER BY data_criacao DESC
    ");

    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'total'   => count($usuarios),
        'dados'   => $usuarios
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'sucesso' => false,
        'erro' => 'Erro ao listar usuários'
    ]);
}
