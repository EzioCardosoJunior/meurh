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

// id_usuario é OPCIONAL
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : null;

try {

    // Monta SQL dinamicamente apenas para o JOIN de candidaturas
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

            -- dados da empresa
            u.id AS id_empresa,
            u.nome AS nome_empresa,

            -- status de candidatura
            CASE 
                WHEN c.id IS NULL THEN 0
                ELSE 1
            END AS ja_candidatado

        FROM vagas v
        INNER JOIN usuarios u 
            ON u.id = v.id_empresa
           AND u.funcao = 'empresa'
    ";

    if ($id_usuario) {
        $sql .= "
            LEFT JOIN candidaturas_vagas c
                ON c.id_vaga = v.id
               AND c.id_usuario = :id_usuario
        ";
    } else {
        $sql .= "
            LEFT JOIN candidaturas_vagas c
                ON 1 = 0
        ";
    }

    $sql .= " ORDER BY v.data_criacao DESC ";

    $stmt = $pdo->prepare($sql);

    if ($id_usuario) {
        $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
    }

    $stmt->execute();
    $vagas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'total'   => count($vagas),
        'dados'   => $vagas
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao listar vagas: ' . $e->getMessage()]);
}
