<?php
require("../config.php");

header('Access-Control-Allow-Origin: *');

$action = new CoachController();

class CoachController
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
                $this->findAllCoach();
            }

        }

    }

    /*************************** CRUD **********************************/


    private function findAllCoach()
    {

        $pdo = Database::connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "Select * from omc_coaches";
        $q = $pdo->prepare($sql);
        $q->execute();
        $data = $q->fetchAll(PDO::FETCH_ASSOC);

        Database::disconnect();
        echo json_encode($data);

    }

}