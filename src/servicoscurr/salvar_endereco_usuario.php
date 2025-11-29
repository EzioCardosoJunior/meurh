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
    empty($dados['tipo_residencia']) ||
    empty($dados['cidade']) ||
    empty($dados['estado']) ||
    empty($dados['bairro']) ||
    empty($dados['rua']) ||
    empty($dados['cep'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Todos os campos obrigatórios devem ser preenchidos.']);
    exit;
}

// Sanitização
$id_usuario      = intval($dados['id_usuario']);
$tipo_residencia = trim($dados['tipo_residencia']);
$cidade          = trim($dados['cidade']);
$estado          = trim($dados['estado']);
$bairro          = trim($dados['bairro']);
$rua             = trim($dados['rua']);
$complemento     = !empty($dados['complemento']) ? trim($dados['complemento']) : null;
$cep             = trim($dados['cep']);

// === Validar tipo de residência ===
if (!in_array($tipo_residencia, ['Propria', 'Alugada', 'Outros'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Tipo de residência inválido.']);
    exit;
}

// === VERIFICAR SE O USUÁRIO EXISTE ===
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === INSERIR ENDEREÇO DO USUÁRIO ===
$sql = "INSERT INTO endereco_usuario (
            id_usuario, tipo_residencia, cidade, estado, bairro, rua, complemento, cep
        ) VALUES (
            :id_usuario, :tipo_residencia, :cidade, :estado, :bairro, :rua, :complemento, :cep
        )";

$stmt = $pdo->prepare($sql);

$ok = $stmt->execute([
    ':id_usuario'      => $id_usuario,
    ':tipo_residencia' => $tipo_residencia,
    ':cidade'          => $cidade,
    ':estado'          => $estado,
    ':bairro'          => $bairro,
    ':rua'             => $rua,
    ':complemento'     => $complemento,
    ':cep'             => $cep
]);

if ($ok) {
    echo json_encode([
        'sucesso'  => true,
        'mensagem' => 'Endereço cadastrado com sucesso!'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao salvar registro de endereço.']);
}
?>
