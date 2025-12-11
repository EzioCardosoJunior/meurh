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

// Valida usuário
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);
if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// Valida vaga
$stmt = $pdo->prepare("SELECT id FROM vagas WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_vaga]);
if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Vaga não encontrada.']);
    exit;
}

// Inserir candidatura
try {
    $sql = "
        INSERT INTO candidaturas_vagas (id_usuario, id_vaga, data_candidatura)
        VALUES (:id_usuario, :id_vaga, NOW())
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id_usuario' => $id_usuario,
        ':id_vaga'    => $id_vaga
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Candidatura realizada com sucesso!'
    ]);

} catch (PDOException $e) {

    // Violação de índice único (já candidatado)
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(['erro' => 'Você já se candidatou a esta vaga.']);
        exit;
    }

    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao candidatar-se: ' . $e->getMessage()]);
}
