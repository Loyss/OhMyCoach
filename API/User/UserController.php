<?php
require("../config.php");

header('Access-Control-Allow-Origin: *');

$action = new UserController();

class UserController
{

    var $params = array();
    var $url = '';

    public function __construct()
    {
        $this->getParams();
        $this->initialize();
    }

    private function getParams()
    {
        $this->params = file_get_contents("php://input");
        $this->params = json_decode($this->params);
    }

    private function initialize()
    {
        if($this->params->type == "user"){

            if ($this->params->action == "findAll"){
                $this->findAllUser();
            }
            if ($this->params->action == "register"){
                $this->register();
            }
            if ($this->params->action == "login"){
                $this->login();
            }
            if ($this->params->action == "delete"){
                $this->deleteUser();
            }
        }

    }

    /*************************** CRUD **********************************/


    private function findAllUser()
    {

        $pdo = Database::connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "Select * from omc_users";
        $q = $pdo->prepare($sql);
        $q->execute();
        $data = $q->fetchAll(PDO::FETCH_ASSOC);

        Database::disconnect();
        echo json_encode($data);

    }

    private function register(){

        if (!empty($this->params->user)) {

            $user_pseudo = $this->params->user->user_pseudo;
            $user_email = $this->params->user->user_email;
            $user_password = $this->params->user->user_password;
            $data['success'] = "";

            if ( (!empty($user_pseudo) && !empty($user_email) && !empty($user_password) ) ) {

                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "SELECT user_pseudo, user_email FROM omc_users WHERE user_pseudo = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_pseudo));
                $response= $q->fetch();
                if($response == false) {
                    $sql = "INSERT INTO omc_users (user_pseudo, user_email, user_password) values(?, ?, ?)";
                    $q = $pdo->prepare($sql);
                    $q->execute(array($user_pseudo, $user_email, md5($user_password)));
                    $result = $pdo->lastInsertId();
                    if($result)
                        $data["success"] = true;
                    else
                        $data["success"] = false;
                }
                Database::disconnect();
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($data);
            }
        }
    }

    private function login()
    {
        if (!empty($this->params->user)) {

            $user_email = $this->params->user->user_email;
            $user_password = $this->params->user->user_password;

            if ( (!empty($user_email) && !empty($user_password)) )
            {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                $sql = "SELECT user_email, user_id FROM omc_users WHERE user_email = ? AND user_password = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_email, md5($user_password)));
                $response = $q->fetch(PDO::FETCH_ASSOC);
                $data['user'] = $response;

                if ($response == false) {
                    $data["success"] = false;
                }
                else {
                    $data["success"] = true;
                }
                Database::disconnect();
                //RESPONSE
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($data);
            }
        }
    }

    private function deleteUser(){

        if (!empty($this->params->user)) {

            $user_id = $this->params->user->user_id;
            $user_email = $this->params->user->user_email;

            if (!empty($user_id) && !empty($user_email)) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "DELETE FROM omc_users WHERE user_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_id));
                Database::disconnect();
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($q);
            }
        }
    }


}