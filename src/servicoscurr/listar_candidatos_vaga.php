<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

$id_empresa = isset($_GET['id_empresa']) ? intval($_GET['id_empresa']) : 0;
$id_vaga = isset($_GET['id_vaga']) ? intval($_GET['id_vaga']) : 0;

if ($id_empresa <= 0 || $id_vaga <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetros inválidos.']);
    exit;
}

// Confirmar que a vaga pertence à empresa
$stmt = $pdo->prepare("SELECT id FROM vagas WHERE id = :id_vaga AND id_empresa = :id_empresa");
$stmt->execute([':id_vaga' => $id_vaga, ':id_empresa' => $id_empresa]);
if ($stmt->rowCount() === 0) {
    http_response_code(403);
    echo json_encode(['erro' => 'Esta vaga não pertence à empresa.']);
    exit;
}

try {
    $sql = "
        SELECT 
            c.id AS id_candidatura,
            u.id AS id_usuario,
            u.nome AS nome_candidato,
            u.email,
            u.cpf,
            c.data_candidatura,
            c.status,
            c.agendado
        FROM candidaturas_vagas c
        INNER JOIN usuarios u ON u.id = c.id_usuario
        WHERE c.id_vaga = :id_vaga
        ORDER BY c.data_candidatura DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id_vaga', $id_vaga, PDO::PARAM_INT);
    $stmt->execute();

    $candidatos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'total' => count($candidatos),
        'dados' => $candidatos
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'erro' => 'Erro ao buscar candidatos',
        'detalhe' => $e->getMessage()
    ]);
}
