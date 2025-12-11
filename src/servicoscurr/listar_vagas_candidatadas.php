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

$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if ($id_usuario <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do usuário inválido.']);
    exit;
}

try {
    $sql = "
        SELECT 
            v.id,
            v.titulo,
            v.descricao,
            v.salario,
            v.modelo_trabalho,
            v.tipo_contrato,
            v.cidade,
            v.estado,
            DATE_FORMAT(v.data_criacao, '%d/%m/%Y %H:%i') AS data_criacao,
            u.nome AS nome_empresa,
            c.id AS id_candidatura
        FROM candidaturas_vagas c
        INNER JOIN vagas v ON v.id = c.id_vaga
        INNER JOIN usuarios u ON u.id = v.id_empresa
        WHERE c.id_usuario = :id_usuario
        ORDER BY c.data_candidatura DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
    $stmt->execute();

    $vagas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'total' => count($vagas),
        'dados' => $vagas
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'erro' => 'Erro ao listar candidaturas',
        'detalhe' => $e->getMessage()
    ]);
}
