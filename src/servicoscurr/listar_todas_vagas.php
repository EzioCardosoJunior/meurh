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

// ID opcional — somente informado quando usuário está logado
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : null;

try {

    // =================================================
    // COM USUÁRIO LOGADO (verifica candidatura)
    // =================================================
    if ($id_usuario) {

        $sql = "
            SELECT 
                v.id,
                v.titulo,
                v.descricao,
                v.salario,

                -- NOVOS CAMPOS
                v.segmento,
                v.jornada_trabalho,

                v.modelo_trabalho,
                v.tipo_contrato,
                v.cidade,
                v.estado,
                DATE_FORMAT(v.data_criacao, '%d/%m/%Y %H:%i') AS data_criacao,

                u.nome AS nome_empresa,

                CASE 
                    WHEN c.id IS NULL THEN 0 
                    ELSE 1 
                END AS ja_candidatado

            FROM vagas v
            INNER JOIN usuarios u 
                ON u.id = v.id_empresa

            LEFT JOIN candidaturas_vagas c
                ON c.id_vaga = v.id
               AND c.id_usuario = :id_usuario

            WHERE u.funcao = 'empresa'
            ORDER BY v.data_criacao DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();

    } 
    // =================================================
    // VISITANTE — SEM USUÁRIO
    // =================================================
    else {

        $sql = "
            SELECT 
                v.id,
                v.titulo,
                v.descricao,
                v.salario,

                -- NOVOS CAMPOS
                v.segmento,
                v.jornada_trabalho,

                v.modelo_trabalho,
                v.tipo_contrato,
                v.cidade,
                v.estado,
                DATE_FORMAT(v.data_criacao, '%d/%m/%Y %H:%i') AS data_criacao,

                u.nome AS nome_empresa,
                0 AS ja_candidatado

            FROM vagas v
            INNER JOIN usuarios u 
                ON u.id = v.id_empresa
            WHERE u.funcao = 'empresa'
            ORDER BY v.data_criacao DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }

    $vagas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'total'   => count($vagas),
        'dados'   => $vagas
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'erro'    => 'Erro ao listar vagas',
        'detalhe' => $e->getMessage()
    ]);
}
