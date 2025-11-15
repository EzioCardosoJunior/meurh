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

// === RECEBE DADOS JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

if (
    !$dados ||
    empty($dados['id_usuario']) ||
    empty($dados['chave_pix']) ||
    empty($dados['titular_nome']) ||
    empty($dados['titular_cpf'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Todos os campos são obrigatórios.']);
    exit;
}

$id_usuario   = intval($dados['id_usuario']);
$chave_pix    = trim($dados['chave_pix']);
$titular_nome = trim($dados['titular_nome']);
$titular_cpf  = trim($dados['titular_cpf']);

// === VERIFICAR SE USUÁRIO EXISTE === 
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === INSERE CHAVE PIX ===
$sql = "INSERT INTO pix (id_usuario, chave_pix, titular_nome, titular_cpf)
        VALUES (:id_usuario, :chave_pix, :titular_nome, :titular_cpf)";

$stmt = $pdo->prepare($sql);
$ok = $stmt->execute([
    ':id_usuario' => $id_usuario,
    ':chave_pix'  => $chave_pix,
    ':titular_nome' => $titular_nome,
    ':titular_cpf' => $titular_cpf
]);

if ($ok) {
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Chave PIX cadastrada com sucesso!'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao salvar chave PIX.']);
}
?>
