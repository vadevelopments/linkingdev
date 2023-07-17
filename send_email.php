<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/vendor/phpmailer/phpmailer/src/Exception.php';
require 'phpmailer/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'phpmailer/vendor/phpmailer/phpmailer/src/SMTP.php';

session_start();

//Configure JSON response
$response = [
    'success_msg' =>  '',
    'error_msg' => '',
    'name_err' => '',
    'email_err' => '',
    'message_err' => '',
];

try {
    $mail = new PHPMailer(true); 
    $mail->isSMTP();                                     
    $mail->Host = $_SERVER['HTTP_PHP_MAILER_HOST'];
    $mail->SMTPAuth = true;               
    $mail->Port = $_SERVER['HTTP_PHP_MAILER_PORT'];   
    $mail->Username = $_SERVER['HTTP_PHP_MAILER_USERNAME']; 
    $mail->Password = $_SERVER['HTTP_PHP_MAILER_PASSWORD'];
    $mail->SMTPOptions = array(
        'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
        )
    );                         
    $mail->SMTPSecure = 'ssl';  
} catch(Exception $e) {
    $response['error_msg'] = 'Sending email failed.';
    exit(json_encode($response));
}

$contnetType = isset($_SERVER['CONTENT_TYPE']) ? trim($_SERVER['CONTENT_TYPE']) : '';

if (strpos($contnetType, 'multipart/form-data') !== false) {

    $decoded = $_POST; // Use $_POST directly for form data

    if(is_array($decoded)) {

        foreach($decoded as $name => $value) {
            $decoded[$name] = trim(filter_var($value, FILTER_SANITIZE_STRING));
        }

        //Error checking
        if(empty($decoded['email'])) {
            $response['email_err'] = 'Email field cannot be empty.';
        } else if(filter_var($decoded['email'], FILTER_VALIDATE_EMAIL) === false) {
            $response['email_err'] = 'Invalid email.';
        }

        if(empty($decoded['name'])) {
            $response['name_err'] = 'Name field cannot be empty.';
        }

        if(empty($decoded['message'])) {
            $response['message_err'] = 'Message field cannot be empty.';
        }

        //Exit sending email if has an error
        foreach($response as $type => $message) {
            if(!empty($response[$type])) {
                exit(json_encode($response));
            }
        }

        //Sending email
        try {
            $mail->setFrom($_SERVER['HTTP_PHP_MAILER_USERNAME']);
            $mail->Subject = $decoded['subject'];
            $mail->isHTML(true);
            $mail->Body = '<p>From: ' . $decoded['name'] . ' &lt;' . $decoded['email'] . '&gt;</p><p>Message:</p><p>' . $decoded['message'] . '</p>';

            $mail->addAddress($_SERVER['RECIPIENT_EMAIL']);
            $mail->addReplyTo($decoded['email']);
            $mail->send();
        } catch(Exception $e) {
            $response['error_msg'] = 'Sending email failed.';
            exit(json_encode($response));
        }

        //Sucsess response
        $response['success_msg'] = 'Form successfully sent.';
        exit(json_encode($response));
    }
}

$response['error_msg'] = 'Sending email failed.';
exit(json_encode($response));
?>