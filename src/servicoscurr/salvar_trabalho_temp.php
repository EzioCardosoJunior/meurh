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

// === RECEBER JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

if (
    !$dados ||
    empty($dados['id_usuario']) ||
    empty($dados['breve_descricao']) ||
    empty($dados['data_realizacao']) ||
    empty($dados['duracao']) ||
    empty($dados['nome_empresa_cliente']) ||
    empty($dados['telefone_contato'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Todos os campos são obrigatórios.']);
    exit;
}

// === Sanitização ===
$id_usuario            = intval($dados['id_usuario']);
$breve_descricao       = trim($dados['breve_descricao']);
$data_realizacao       = trim($dados['data_realizacao']);
$duracao               = trim($dados['duracao']);
$nome_empresa_cliente  = trim($dados['nome_empresa_cliente']);
$telefone_contato      = trim($dados['telefone_contato']);

// === VERIFICAR SE O USUÁRIO EXISTE ===
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

// === INSERIR REGISTRO ===
$sql = "INSERT INTO trabalhos_temp (
            id_usuario,
            breve_descricao,
            data_realizacao,
            duracao,
            nome_empresa_cliente,
            telefone_contato
        ) VALUES (
            :id_usuario,
            :breve_descricao,
            :data_realizacao,
            :duracao,
            :nome_empresa_cliente,
            :telefone_contato
        )";

try {
    $stmt = $pdo->prepare($sql);

    $ok = $stmt->execute([
        ':id_usuario'           => $id_usuario,
        ':breve_descricao'      => $breve_descricao,
        ':data_realizacao'      => $data_realizacao,
        ':duracao'              => $duracao,
        ':nome_empresa_cliente' => $nome_empresa_cliente,
        ':telefone_contato'     => $telefone_contato
    ]);

    if ($ok) {
        echo json_encode([
            'sucesso'  => true,
            'mensagem' => 'Registro salvo com sucesso!',
            'id'       => $pdo->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Falha ao salvar registro.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao inserir registro: ' . $e->getMessage()]);
}
?>
