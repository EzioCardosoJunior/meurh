<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// Conexão
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
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

// Recebe JSON
$dados = json_decode(file_get_contents("php://input"), true);

if (
    !$dados ||
    empty($dados['id_usuario']) ||
    empty($dados['id_vaga'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetros obrigatórios não informados.']);
    exit;
}

$id_usuario = intval($dados['id_usuario']);
$id_vaga    = intval($dados['id_vaga']);

try {
    $stmt = $pdo->prepare("
        DELETE FROM candidaturas
        WHERE id_usuario = :id_usuario
          AND id_vaga = :id_vaga
        LIMIT 1
    ");

    $stmt->execute([
        ':id_usuario' => $id_usuario,
        ':id_vaga'    => $id_vaga
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Candidatura cancelada com sucesso!'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao cancelar candidatura: ' . $e->getMessage()]);
}
