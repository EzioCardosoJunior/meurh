<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONFIGURAÇÃO DE BANCO ===
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
    empty($dados['titular_nome']) ||
    empty($dados['titular_sobrenome']) ||
    empty($dados['banco']) ||
    empty($dados['agencia']) ||
    empty($dados['conta'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Todos os campos são obrigatórios: id_usuario, titular_nome, titular_sobrenome, banco, agencia, conta.']);
    exit;
}

// Sanitização básica
$id_usuario = intval($dados['id_usuario']);
$titular_nome = trim($dados['titular_nome']);
$titular_sobrenome = trim($dados['titular_sobrenome']);
$banco = trim($dados['banco']);
$agencia = trim($dados['agencia']);
$conta = trim($dados['conta']);

// Verifica se usuário existe
try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Usuário não encontrado.']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao verificar usuário: ' . $e->getMessage()]);
    exit;
}

// Inserção da conta bancária
try {
    $sql = "INSERT INTO contas_bancarias (id_usuario, titular_nome, titular_sobrenome, banco, agencia, conta)
            VALUES (:id_usuario, :titular_nome, :titular_sobrenome, :banco, :agencia, :conta)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id_usuario' => $id_usuario,
        ':titular_nome' => $titular_nome,
        ':titular_sobrenome' => $titular_sobrenome,
        ':banco' => $banco,
        ':agencia' => $agencia,
        ':conta' => $conta
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Conta bancária cadastrada com sucesso.',
        'id' => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    // Se for erro de integridade referencial, trate adequadamente
    echo json_encode(['erro' => 'Erro ao cadastrar conta: ' . $e->getMessage()]);
}
?>
