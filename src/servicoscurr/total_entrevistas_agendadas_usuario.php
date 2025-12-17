<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// CONEXÃO
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
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão']);
    exit;
}

// === RECEBE O ID ===
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if ($id_usuario <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do usuário inválido']);
    exit;
}

try {

    $sql = "
        SELECT 
            COUNT(*) AS total
        FROM candidaturas_vagas
        WHERE agendado = 'SIM'
          AND id_usuario = :id_usuario
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
    $stmt->execute();

    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'total' => (int) ($resultado['total'] ?? 0)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'erro' => 'Erro na consulta',
        'detalhe' => $e->getMessage()
    ]);
}
