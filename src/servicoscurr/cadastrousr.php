<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

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

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    http_response_code(400);
    echo json_encode(['erro' => 'Nenhum dado enviado.']);
    exit;
}

// === CAMPOS OBRIGATÓRIOS ===
$camposObrigatorios = ['nome_usuario', 'email', 'cpf', 'senha'];
foreach ($camposObrigatorios as $campo) {
    if (empty($dados[$campo])) {
        http_response_code(400);
        echo json_encode(['erro' => "Campo obrigatório ausente: $campo"]);
        exit;
    }
}

// === TRATAMENTO ===
$nome              = $dados['nome'] ?? null;
$nome_usuario      = trim($dados['nome_usuario']);
$email             = trim($dados['email']);
$data_nascimento   = $dados['data_nascimento'] ?? null;

$cpf               = preg_replace('/\D/', '', $dados['cpf']);
$cnpj              = !empty($dados['cnpj']) ? preg_replace('/\D/', '', $dados['cnpj']) : null;

$senha             = password_hash($dados['senha'], PASSWORD_DEFAULT);

$rg                = !empty($dados['rg']) ? trim($dados['rg']) : null;
$reservista        = !empty($dados['reservista']) ? trim($dados['reservista']) : null;
$cnh               = !empty($dados['cnh']) ? trim($dados['cnh']) : null;

$funcao            = 'funcionario';
$status            = 'ativo';

// === INSERT ===
$sql = "INSERT INTO usuarios 
(
    nome, nome_usuario, email, data_nascimento, cpf, cnpj,
    cnh, reservista, rg,
    senha, senha_anterior, status, funcao
)
VALUES
(
    :nome, :nome_usuario, :email, :data_nascimento, :cpf, :cnpj,
    :cnh, :reservista, :rg, :pontos,
    :senha, NULL, :status, :funcao
)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome'              => $nome,
        ':nome_usuario'      => $nome_usuario,
        ':email'             => $email,
        ':data_nascimento'   => $data_nascimento,
        ':cpf'               => $cpf,
        ':cnpj'              => $cnpj,
        ':cnh'               => $cnh,
        ':reservista'        => $reservista,
        ':rg'                => $rg,
        ':pontos'            => $pontos,
        ':senha'             => $senha,
        ':status'            => $status,
        ':funcao'            => $funcao
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Usuário cadastrado com sucesso!',
        'id' => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(['erro' => 'Usuário, CPF ou e-mail já cadastrado.']);
        exit;
    }

    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao cadastrar: ' . $e->getMessage()]);
}
?>
