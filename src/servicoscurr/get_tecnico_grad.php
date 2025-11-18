<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONEXÃO COM O BANCO ===
$host = 'mysql.tendappromos.com.br';
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

// === VALIDAR PARÂMETRO ===
if (!isset($_GET['id_usuario']) || empty($_GET['id_usuario'])) {
    http_response_code(400);
    echo json_encode(['erro' => "Parâmetro 'id_usuario' é obrigatório."]);
    exit;
}

$id_usuario = intval($_GET['id_usuario']);

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

// === BUSCAR REGISTROS ===
$sql = "SELECT 
            id,
            id_usuario,
            instituicao_nome,
            cidade_estado,
            curso_nome,
            nivel,
            data_inicio,
            data_fim,
            status
        FROM ensino_tecnico_graduacao
        WHERE id_usuario = :id_usuario
        ORDER BY data_inicio DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id_usuario' => $id_usuario]);
    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso'  => true,
        'mensagem' => 'Registros encontrados.',
        'dados'    => $dados
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao consultar registros: ' . $e->getMessage()]);
}
?>
