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

    // === RECEBER JSON DO FRONTEND ===
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['erro' => 'Nenhum dado enviado.']);
        exit;
    }

    // === VALIDAR CAMPOS ===
    $campos_obrigatorios = [
        'id_usuario',
        'fundamental_instituicao',
        'fundamental_ano_conclusao',
        'medio_instituicao',
        'medio_ano_conclusao'
    ];

    foreach ($campos_obrigatorios as $campo) {
        if (!isset($input[$campo]) || $input[$campo] === '') {
            http_response_code(400);
            echo json_encode(['erro' => "Campo obrigatório ausente: $campo"]);
            exit;
        }
    }

    $id_usuario = intval($input['id_usuario']);
    $fund_inst = trim($input['fundamental_instituicao']);
    $fund_ano = intval($input['fundamental_ano_conclusao']);
    $medio_inst = trim($input['medio_instituicao']);
    $medio_ano = intval($input['medio_ano_conclusao']);

    // === VERIFICAR SE USUÁRIO EXISTE ===
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

    // === INSERIR REGISTRO ===
    $sql = "INSERT INTO ensino_fundamental_medio 
            (id_usuario, fundamental_instituicao, fundamental_ano_conclusao, medio_instituicao, medio_ano_conclusao)
            VALUES 
            (:id_usuario, :fund_inst, :fund_ano, :medio_inst, :medio_ano)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id_usuario' => $id_usuario,
            ':fund_inst' => $fund_inst,
            ':fund_ano' => $fund_ano,
            ':medio_inst' => $medio_inst,
            ':medio_ano' => $medio_ano
        ]);

        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Registro salvo com sucesso!'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao salvar registro: ' . $e->getMessage()]);
    }
    ?>
