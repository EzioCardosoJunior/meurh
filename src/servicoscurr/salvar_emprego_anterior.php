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
    empty($dados['nome_empresa']) ||
    empty($dados['data_entrada']) ||
    empty($dados['cargo_funcao'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Campos obrigatórios não foram preenchidos.']);
    exit;
}

// === ESCAPA E PREPARA VARIÁVEIS ===
$id_usuario        = intval($dados['id_usuario']);
$nome_empresa      = trim($dados['nome_empresa']);
$data_entrada      = trim($dados['data_entrada']);
$data_saida        = !empty($dados['data_saida']) ? trim($dados['data_saida']) : null;

$chefe_nome        = !empty($dados['chefe_nome']) ? trim($dados['chefe_nome']) : null;
$chefe_contato     = !empty($dados['chefe_contato']) ? trim($dados['chefe_contato']) : null;

$cargo_funcao      = trim($dados['cargo_funcao']);
$descricao_ativ    = !empty($dados['descricao_atividades']) ? trim($dados['descricao_atividades']) : null;

// === VERIFICAR SE USUÁRIO EXISTE ===
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === INSERIR EMPREGO ANTERIOR ===
$sql = "INSERT INTO empregos_anteriores 
        (id_usuario, nome_empresa, data_entrada, data_saida, chefe_nome, chefe_contato, cargo_funcao, descricao_atividades)
        VALUES 
        (:id_usuario, :nome_empresa, :data_entrada, :data_saida, :chefe_nome, :chefe_contato, :cargo_funcao, :descricao_atividades)";

$stmt = $pdo->prepare($sql);

$ok = $stmt->execute([
    ':id_usuario'        => $id_usuario,
    ':nome_empresa'      => $nome_empresa,
    ':data_entrada'      => $data_entrada,
    ':data_saida'        => $data_saida,
    ':chefe_nome'        => $chefe_nome,
    ':chefe_contato'     => $chefe_contato,
    ':cargo_funcao'      => $cargo_funcao,
    ':descricao_atividades' => $descricao_ativ
]);

if ($ok) {
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Emprego anterior cadastrado com sucesso!'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao salvar emprego anterior.']);
}
?>
