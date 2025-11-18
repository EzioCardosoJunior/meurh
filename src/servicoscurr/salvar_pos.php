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
    empty($dados['instituicao']) ||
    empty($dados['cidade_estado']) ||
    empty($dados['nome_curso']) ||
    empty($dados['nivel']) ||
    empty($dados['data_inicio']) ||
    empty($dados['data_fim'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Todos os campos são obrigatórios.']);
    exit;
}

// Sanitização
$id_usuario     = intval($dados['id_usuario']);
$instituicao    = trim($dados['instituicao']);
$cidade_estado  = trim($dados['cidade_estado']);
$nome_curso     = trim($dados['nome_curso']);
$nivel          = trim($dados['nivel']);
$data_inicio    = trim($dados['data_inicio']);
$data_fim       = trim($dados['data_fim']);

// === VERIFICAR SE O USUÁRIO EXISTE ===
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === INSERIR PÓS-GRADUAÇÃO ===
$sql = "INSERT INTO pos_graduacao (
            id_usuario, instituicao, cidade_estado, nome_curso, nivel, data_inicio, data_fim
        ) VALUES (
            :id_usuario, :instituicao, :cidade_estado, :nome_curso, :nivel, :data_inicio, :data_fim
        )";

$stmt = $pdo->prepare($sql);

$ok = $stmt->execute([
    ':id_usuario'    => $id_usuario,
    ':instituicao'   => $instituicao,
    ':cidade_estado' => $cidade_estado,
    ':nome_curso'    => $nome_curso,
    ':nivel'         => $nivel,
    ':data_inicio'   => $data_inicio,
    ':data_fim'      => $data_fim
]);

if ($ok) {
    echo json_encode([
        'sucesso'  => true,
        'mensagem' => 'Pós-graduação cadastrada com sucesso!'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao salvar registro de pós-graduação.']);
}
?>
