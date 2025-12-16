<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// CONEXÃO
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
    echo json_encode(['erro' => 'Falha na conexão']);
    exit;
}

// ID DA CANDIDATURA
$id_candidatura = isset($_GET['id_candidatura']) ? intval($_GET['id_candidatura']) : 0;

if ($id_candidatura <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID da candidatura inválido']);
    exit;
}

$sql = "
    SELECT 
        e.id,
        e.id_candidatura,
        e.agendado,
        e.data_entrevista,
        e.entrevistador_nome,
        e.entrevista_concluida,
        e.hard_skills,
        e.soft_skills,
        e.alinhamento_cultural,
        e.observacoes
    FROM entrevistas e
    WHERE e.id_candidatura = :id_candidatura
    LIMIT 1
";

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':id_candidatura', $id_candidatura, PDO::PARAM_INT);
$stmt->execute();

$entrevista = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'sucesso' => true,
    'dados' => $entrevista ?: null
]);
