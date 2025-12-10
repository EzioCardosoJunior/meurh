<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// Conexão
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

try {
    $stmt = $pdo->prepare("
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
            
            -- dados da empresa
            u.id AS id_empresa,
            u.nome AS nome_empresa

        FROM vagas v
        INNER JOIN usuarios u ON u.id = v.id_empresa
        WHERE u.funcao = 'empresa'
        ORDER BY v.data_criacao DESC
    ");

    $stmt->execute();
    $vagas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'total' => count($vagas),
        'dados' => $vagas
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao listar vagas: ' . $e->getMessage()]);
}
