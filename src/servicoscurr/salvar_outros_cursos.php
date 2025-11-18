<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONFIGURAÇÃO DE BANCO ===
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
    empty($dados['nome_curso']) ||
    empty($dados['instituicao']) ||
    empty($dados['tipo_certificado'])
) {
    http_response_code(400);
    echo json_encode([
        'erro' => 'Campos obrigatórios: id_usuario, nome_curso, instituicao, tipo_certificado.'
    ]);
    exit;
}

// Sanitização básica
$id_usuario       = intval($dados['id_usuario']);
$nome_curso       = trim($dados['nome_curso']);
$instituicao      = trim($dados['instituicao']);
$tipo_certificado = trim($dados['tipo_certificado']);

$duracao_horas = isset($dados['duracao_horas']) ? intval($dados['duracao_horas']) : null;
$duracao_meses = isset($dados['duracao_meses']) ? intval($dados['duracao_meses']) : null;

// Verifica se usuário existe
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

// Inserção do curso
try {
    $sql = "INSERT INTO outros_cursos (
                id_usuario, nome_curso, instituicao, tipo_certificado,
                duracao_horas, duracao_meses
            )
            VALUES (
                :id_usuario, :nome_curso, :instituicao, :tipo_certificado,
                :duracao_horas, :duracao_meses
            )";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id_usuario'       => $id_usuario,
        ':nome_curso'       => $nome_curso,
        ':instituicao'      => $instituicao,
        ':tipo_certificado' => $tipo_certificado,
        ':duracao_horas'    => $duracao_horas,
        ':duracao_meses'    => $duracao_meses
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Curso cadastrado com sucesso.',
        'id' => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao cadastrar curso: ' . $e->getMessage()]);
}
?>
