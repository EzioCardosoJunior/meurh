<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONFIGURAÇÃO DE BANCO ===
$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1'; 

// === CONEXÃO COM PDO ===
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

if (!$dados) {
    http_response_code(400);
    echo json_encode(['erro' => 'Nenhum dado enviado.']);
    exit;
}

// === VALIDAÇÃO ===
$camposObrigatorios = ['nome', 'nome_usuario', 'email', 'data_nascimento', 'cpf', 'senha'];
foreach ($camposObrigatorios as $campo) {
    if (empty($dados[$campo])) {
        http_response_code(400);
        echo json_encode(['erro' => "Campo obrigatório ausente: $campo"]);
        exit;
    }
}

// === TRATA DADOS ===
$nome = trim($dados['nome']);
$nome_usuario = trim($dados['nome_usuario']);
$email = trim($dados['email']);
$data_nascimento = $dados['data_nascimento'];
$cpf = preg_replace('/\D/', '', $dados['cpf']);
$cnpj = isset($dados['cnpj']) ? preg_replace('/\D/', '', $dados['cnpj']) : null;
$senha = password_hash($dados['senha'], PASSWORD_DEFAULT);
$senha_anterior = null;
$status = 'ativo';
$funcao = 'funcionário'; // valor default

// === INSERE NO BANCO ===
try {
    $sql = "INSERT INTO usuarios 
        (nome, nome_usuario, email, data_nascimento, cpf, cnpj, senha, senha_anterior, status, funcao)
        VALUES 
        (:nome, :nome_usuario, :email, :data_nascimento, :cpf, :cnpj, :senha, :senha_anterior, :status, :funcao)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome' => $nome,
        ':nome_usuario' => $nome_usuario,
        ':email' => $email,
        ':data_nascimento' => $data_nascimento,
        ':cpf' => $cpf,
        ':cnpj' => $cnpj,
        ':senha' => $senha,
        ':senha_anterior' => $senha_anterior,
        ':status' => $status,
        ':funcao' => $funcao
    ]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Usuário cadastrado com sucesso!']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(['erro' => 'Usuário, CPF ou e-mail já cadastrado.']);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao cadastrar: ' . $e->getMessage()]);
    }
}
?>
