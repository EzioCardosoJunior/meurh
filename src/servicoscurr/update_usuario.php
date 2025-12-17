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

if (!$dados || empty($dados['id_usuario'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do usuário é obrigatório.']);
    exit;
}

$id_usuario = intval($dados['id_usuario']);

// === CAMPOS NÃO OBRIGATÓRIOS ===
$nome               = !empty($dados['nome']) ? trim($dados['nome']) : null;
$email              = !empty($dados['email']) ? trim($dados['email']) : null;
$data_nascimento    = !empty($dados['data_nascimento']) ? trim($dados['data_nascimento']) : null;
$cpf                = !empty($dados['cpf']) ? trim($dados['cpf']) : null;
$cnpj               = !empty($dados['cnpj']) ? trim($dados['cnpj']) : null;

$cnh                = !empty($dados['cnh']) ? trim($dados['cnh']) : null;
$reservista         = !empty($dados['reservista']) ? trim($dados['reservista']) : null;
$rg                 = !empty($dados['rg']) ? trim($dados['rg']) : null;
$pontos             = isset($dados['pontos_preenchimento']) ? $dados['pontos_preenchimento'] : null;

// === VERIFICAR SE O USUÁRIO EXISTE ===
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === MONTAR SQL DINÂMICO (SOMENTE CAMPOS ENVIADOS) ===
$campos = [];
$parametros = [':id_usuario' => $id_usuario];

if ($nome !== null) { $campos[] = "nome = :nome"; $parametros[':nome'] = $nome; }
if ($email !== null) { $campos[] = "email = :email"; $parametros[':email'] = $email; }
if ($data_nascimento !== null) { $campos[] = "data_nascimento = :data_nasc"; $parametros[':data_nasc'] = $data_nascimento; }
if ($cpf !== null) { $campos[] = "cpf = :cpf"; $parametros[':cpf'] = $cpf; }
if ($cnpj !== null) { $campos[] = "cnpj = :cnpj"; $parametros[':cnpj'] = $cnpj; }

if ($cnh !== null) { $campos[] = "cnh = :cnh"; $parametros[':cnh'] = $cnh; }
if ($reservista !== null) { $campos[] = "reservista = :reservista"; $parametros[':reservista'] = $reservista; }
if ($rg !== null) { $campos[] = "rg = :rg"; $parametros[':rg'] = $rg; }
if ($pontos !== null) { $campos[] = "pontos_preenchimento = :pontos"; $parametros[':pontos'] = $pontos; }

// se nada foi enviado
if (empty($campos)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Nenhum campo enviado para atualização.']);
    exit;
}

$set_sql = implode(", ", $campos);

$sql = "UPDATE usuarios SET $set_sql WHERE id = :id_usuario LIMIT 1";

try {
    $stmt = $pdo->prepare($sql);
    $ok = $stmt->execute($parametros);

    if ($ok) {
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Dados do usuário atualizados com sucesso!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Falha ao atualizar usuário.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao atualizar registro: ' . $e->getMessage()]);
}
?>
