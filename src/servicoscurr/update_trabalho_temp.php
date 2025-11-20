<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONEXÃO COM O BANCO ===
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

// === RECEBE OS DADOS JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

if (
    !$dados ||
    empty($dados['id_usuario']) ||
    empty($dados['id']) ||  // id do trabalho_temp
    empty($dados['descricao']) ||
    empty($dados['data_realizacao']) ||
    empty($dados['duracao'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Todos os campos obrigatórios devem ser preenchidos.']);
    exit;
}

$id_usuario      = intval($dados['id_usuario']);
$id_trabalho     = intval($dados['id']);
$descricao       = trim($dados['descricao']);
$data_realizacao = trim($dados['data_realizacao']);
$duracao         = trim($dados['duracao']);
$empresa         = $dados['empresa'] ?? null;
$telefone        = $dados['telefone'] ?? null;

// === VERIFICAR SE USUÁRIO EXISTE ===
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === VERIFICAR SE O TRABALHO TEMP PERTENCE AO USUÁRIO ===
$stmt = $pdo->prepare("
    SELECT id 
    FROM trabalhos_temp 
    WHERE id = :id AND id_usuario = :id_usuario 
    LIMIT 1
");
$stmt->execute([
    ':id' => $id_trabalho,
    ':id_usuario' => $id_usuario
]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Registro não encontrado ou não pertence ao usuário.']);
    exit;
}

// === ATUALIZAR O REGISTRO ===
$sql = "UPDATE trabalhos_temp
        SET 
            descricao = :descricao,
            data_realizacao = :data_realizacao,
            duracao = :duracao,
            empresa = :empresa,
            telefone = :telefone,
            atualizado_em = NOW()
        WHERE id = :id
        LIMIT 1";

$stmt = $pdo->prepare($sql);

$ok = $stmt->execute([
    ':descricao'       => $descricao,
    ':data_realizacao' => $data_realizacao,
    ':duracao'         => $duracao,
    ':empresa'         => $empresa,
    ':telefone'        => $telefone,
    ':id'              => $id_trabalho
]);

if ($ok) {
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Registro atualizado com sucesso!'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao atualizar o registro.']);
}
