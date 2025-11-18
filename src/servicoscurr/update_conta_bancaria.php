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

// Verifica se registro existe
try {
    $stmt = $pdo->prepare("SELECT id FROM contas_bancarias WHERE id_usuario = :id_usuario LIMIT 1");
    $stmt->execute([':id_usuario' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Nenhuma conta bancária encontrada para este usuário.']);
        exit;
    }

    $id_conta = $stmt->fetch(PDO::FETCH_ASSOC)['id'];

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao localizar conta: ' . $e->getMessage()]);
    exit;
}

// Atualização da conta bancária
try {
    $sql = "UPDATE contas_bancarias 
            SET titular_nome = :titular_nome,
                titular_sobrenome = :titular_sobrenome,
                banco = :banco,
                agencia = :agencia,
                conta = :conta,
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id_usuario = :id_usuario";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':titular_nome' => $titular_nome,
        ':titular_sobrenome' => $titular_sobrenome,
        ':banco' => $banco,
        ':agencia' => $agencia,
        ':conta' => $conta,
        ':id_usuario' => $id_usuario
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Conta bancária atualizada com sucesso.',
        'id' => $id_conta
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao atualizar conta: ' . $e->getMessage()]);
}
?>
