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
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

// Receber JSON
$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados || empty($dados['id_vaga'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID da vaga não informado.']);
    exit;
}

$id_vaga = intval($dados['id_vaga']);

// Verificar se a vaga existe
try {
    $stmt = $pdo->prepare("SELECT id FROM vagas WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id_vaga]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Vaga não encontrada.']);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(['erro' => 'Erro ao validar vaga: ' . $e->getMessage()]);
    exit;
}

// Deletar vaga
try {
    $stmt = $pdo->prepare("DELETE FROM vagas WHERE id = :id LIMIT 1");
    $ok = $stmt->execute([':id' => $id_vaga]);

    if ($ok) {
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Vaga deletada com sucesso!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Falha ao deletar vaga.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao deletar vaga: ' . $e->getMessage()]);
}
?>
