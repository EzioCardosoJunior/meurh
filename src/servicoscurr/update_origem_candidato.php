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
    empty($dados['nacionalidade']) ||
    empty($dados['nascimento_cidade']) ||
    empty($dados['nascimento_estado']) ||
    empty($dados['nascimento_data'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Campos obrigatórios não informados.']);
    exit;
}

// Sanitização
$id_usuario         = intval($dados['id_usuario']);
$nacionalidade      = trim($dados['nacionalidade']);
$nascimento_cidade  = trim($dados['nascimento_cidade']);
$nascimento_estado  = trim($dados['nascimento_estado']);
$nascimento_data    = trim($dados['nascimento_data']);
$nome_pai           = !empty($dados['nome_pai']) ? trim($dados['nome_pai']) : null;
$nome_mae           = !empty($dados['nome_mae']) ? trim($dados['nome_mae']) : null;

// === Validar nacionalidade ===
if (!in_array($nacionalidade, ['Brasileiro', 'Estrangeiro'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Nacionalidade inválida.']);
    exit;
}

// === VERIFICAR SE O REGISTRO EXISTE ===
try {
    // CORRIGIDO: ANTES BUSCAVA id (que nem existe). Agora busca id_usuario.
    $stmt = $pdo->prepare("SELECT id_usuario FROM origem_candidato WHERE id_usuario = :id LIMIT 1");
    $stmt->execute([':id' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Registro de origem do candidato não encontrado.']);
        exit;
    }

    $id_registro = $stmt->fetchColumn(); // retorna o mesmo id_usuario

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao verificar registro: ' . $e->getMessage()]);
    exit;
}

// === REALIZAR O UPDATE ===
$sql = "UPDATE origem_candidato SET
            nacionalidade = :nacionalidade,
            nascimento_cidade = :nascimento_cidade,
            nascimento_estado = :nascimento_estado,
            nascimento_data = :nascimento_data,
            nome_pai = :nome_pai,
            nome_mae = :nome_mae
        WHERE id_usuario = :id_usuario
        LIMIT 1";

try {
    $stmt = $pdo->prepare($sql);
    $ok = $stmt->execute([
        ':nacionalidade'     => $nacionalidade,
        ':nascimento_cidade' => $nascimento_cidade,
        ':nascimento_estado' => $nascimento_estado,
        ':nascimento_data'   => $nascimento_data,
        ':nome_pai'          => $nome_pai,
        ':nome_mae'          => $nome_mae,
        ':id_usuario'        => $id_usuario
    ]);

    if ($ok) {
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Origem do candidato atualizada com sucesso!',
            'id_registro' => $id_registro
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Falha ao atualizar registro.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao atualizar registro: ' . $e->getMessage()]);
}
?>
