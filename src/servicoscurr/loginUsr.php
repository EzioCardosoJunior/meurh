<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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

// === RECEBENDO DADOS (POST JSON) ===
$dados = json_decode(file_get_contents("php://input"), true);
if (!$dados || empty($dados['nome_usuario']) || empty($dados['senha'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Usuário e senha são obrigatórios.']);
    exit;
}

$nome_usuario = trim($dados['nome_usuario']);
$senha = $dados['senha'];

// === BUSCA USUÁRIO ===
$sql = "SELECT id, nome, nome_usuario, funcao, cpf, senha, status FROM usuarios WHERE nome_usuario = :nome_usuario LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute([':nome_usuario' => $nome_usuario]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$usuario) {
    http_response_code(401);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === VERIFICA SENHA ===
if (!password_verify($senha, $usuario['senha'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Senha incorreta.']);
    exit;
}

// === VERIFICA STATUS ===
if ($usuario['status'] !== 'ativo') {
    http_response_code(403);
    echo json_encode(['erro' => 'Usuário inativo.']);
    exit;
}

// === ATUALIZA ULTIMO LOGIN ===
$pdo->prepare("UPDATE usuarios SET ultimo_login = NOW() WHERE id = :id")
    ->execute([':id' => $usuario['id']]);

// === GERA TOKEN SIMPLES ===
// Em produção, use JWT. Aqui um token básico só para teste:
$token = base64_encode(random_bytes(16));

echo json_encode([
    'sucesso' => true,
    'mensagem' => 'Login realizado com sucesso!',
    'usuario' => [
        'id' => $usuario['id'],
        'nome' => $usuario['nome'],
        'nome_usuario' => $usuario['nome_usuario'],
        'funcao' => $usuario['funcao'],
        'cpf' => $usuario['cpf'],
        'status' => $usuario['status']
    ],
    'token' => $token
]);
?>
