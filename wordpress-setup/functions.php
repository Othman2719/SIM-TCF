<?php
/**
 * TCF Simulator WordPress Backend Setup
 * Add this code to your WordPress theme's functions.php file
 */

// Enable CORS for React frontend
add_action('init', 'tcf_handle_cors');
function tcf_handle_cors() {
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
}

// Register Custom Post Types for TCF Simulator
add_action('init', 'tcf_register_post_types');
function tcf_register_post_types() {
    
    // Exam Sets
    register_post_type('exam_set', array(
        'labels' => array(
            'name' => 'Exam Sets',
            'singular_name' => 'Exam Set',
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'exam-sets',
        'supports' => array('title', 'editor', 'custom-fields'),
        'menu_icon' => 'dashicons-clipboard',
    ));

    // Questions
    register_post_type('question', array(
        'labels' => array(
            'name' => 'Questions',
            'singular_name' => 'Question',
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'questions',
        'supports' => array('title', 'editor', 'custom-fields'),
        'menu_icon' => 'dashicons-editor-help',
    ));

    // Test Sessions
    register_post_type('test_session', array(
        'labels' => array(
            'name' => 'Test Sessions',
            'singular_name' => 'Test Session',
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'test-sessions',
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-clock',
    ));

    // Test Answers
    register_post_type('test_answer', array(
        'labels' => array(
            'name' => 'Test Answers',
            'singular_name' => 'Test Answer',
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'test-answers',
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-yes-alt',
    ));

    // Test Results
    register_post_type('test_result', array(
        'labels' => array(
            'name' => 'Test Results',
            'singular_name' => 'Test Result',
        ),
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'test-results',
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-chart-bar',
    ));
}

// Add custom fields to REST API
add_action('rest_api_init', 'tcf_register_rest_fields');
function tcf_register_rest_fields() {
    
    // Exam Sets meta fields
    register_rest_field('exam_set', 'meta', array(
        'get_callback' => 'tcf_get_post_meta',
        'update_callback' => 'tcf_update_post_meta',
        'schema' => array(
            'description' => 'Meta fields',
            'type' => 'object',
        ),
    ));

    // Questions meta fields
    register_rest_field('question', 'meta', array(
        'get_callback' => 'tcf_get_post_meta',
        'update_callback' => 'tcf_update_post_meta',
        'schema' => array(
            'description' => 'Meta fields',
            'type' => 'object',
        ),
    ));

    // Test Sessions meta fields
    register_rest_field('test_session', 'meta', array(
        'get_callback' => 'tcf_get_post_meta',
        'update_callback' => 'tcf_update_post_meta',
        'schema' => array(
            'description' => 'Meta fields',
            'type' => 'object',
        ),
    ));

    // Test Answers meta fields
    register_rest_field('test_answer', 'meta', array(
        'get_callback' => 'tcf_get_post_meta',
        'update_callback' => 'tcf_update_post_meta',
        'schema' => array(
            'description' => 'Meta fields',
            'type' => 'object',
        ),
    ));

    // Test Results meta fields
    register_rest_field('test_result', 'meta', array(
        'get_callback' => 'tcf_get_post_meta',
        'update_callback' => 'tcf_update_post_meta',
        'schema' => array(
            'description' => 'Meta fields',
            'type' => 'object',
        ),
    ));

    // User meta fields
    register_rest_field('user', 'meta', array(
        'get_callback' => 'tcf_get_user_meta',
        'update_callback' => 'tcf_update_user_meta',
        'schema' => array(
            'description' => 'User meta fields',
            'type' => 'object',
        ),
    ));
}

// Get post meta for REST API
function tcf_get_post_meta($object, $field_name, $request) {
    $meta = get_post_meta($object['id']);
    $formatted_meta = array();
    
    foreach ($meta as $key => $value) {
        $formatted_meta[$key] = maybe_unserialize($value[0]);
    }
    
    return $formatted_meta;
}

// Update post meta via REST API
function tcf_update_post_meta($value, $object, $field_name) {
    foreach ($value as $key => $val) {
        update_post_meta($object->ID, $key, $val);
    }
    return true;
}

// Get user meta for REST API
function tcf_get_user_meta($object, $field_name, $request) {
    $meta = get_user_meta($object['id']);
    $formatted_meta = array();
    
    foreach ($meta as $key => $value) {
        $formatted_meta[$key] = maybe_unserialize($value[0]);
    }
    
    return $formatted_meta;
}

// Update user meta via REST API
function tcf_update_user_meta($value, $object, $field_name) {
    foreach ($value as $key => $val) {
        update_user_meta($object->ID, $key, $val);
    }
    return true;
}

// Add custom user roles for TCF Simulator
add_action('init', 'tcf_add_user_roles');
function tcf_add_user_roles() {
    // TCF Admin role
    add_role('tcf_admin', 'TCF Administrator', array(
        'read' => true,
        'edit_posts' => true,
        'edit_others_posts' => true,
        'publish_posts' => true,
        'manage_categories' => true,
        'edit_exam_sets' => true,
        'edit_questions' => true,
        'manage_tcf_system' => true,
    ));

    // TCF Client role
    add_role('tcf_client', 'TCF Client', array(
        'read' => true,
        'take_tcf_tests' => true,
        'view_tcf_results' => true,
    ));
}

// Custom REST API endpoints
add_action('rest_api_init', 'tcf_register_custom_endpoints');
function tcf_register_custom_endpoints() {
    
    // Get questions by exam set
    register_rest_route('tcf/v1', '/questions/exam/(?P<exam_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'tcf_get_questions_by_exam',
        'permission_callback' => '__return_true',
    ));

    // Submit test answers
    register_rest_route('tcf/v1', '/submit-test', array(
        'methods' => 'POST',
        'callback' => 'tcf_submit_test',
        'permission_callback' => 'is_user_logged_in',
    ));

    // Get user test results
    register_rest_route('tcf/v1', '/user-results/(?P<user_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'tcf_get_user_results',
        'permission_callback' => 'is_user_logged_in',
    ));
}

// Get questions by exam set ID
function tcf_get_questions_by_exam($request) {
    $exam_id = $request['exam_id'];
    
    $questions = get_posts(array(
        'post_type' => 'question',
        'posts_per_page' => -1,
        'meta_query' => array(
            array(
                'key' => 'exam_set_id',
                'value' => $exam_id,
                'compare' => '='
            )
        )
    ));

    $formatted_questions = array();
    foreach ($questions as $question) {
        $meta = get_post_meta($question->ID);
        $formatted_questions[] = array(
            'id' => $question->ID,
            'title' => $question->post_title,
            'content' => $question->post_content,
            'meta' => array_map(function($value) {
                return maybe_unserialize($value[0]);
            }, $meta)
        );
    }

    return $formatted_questions;
}

// Submit test answers and calculate results
function tcf_submit_test($request) {
    $user_id = get_current_user_id();
    $data = $request->get_json_params();
    
    // Save test session
    $session_id = wp_insert_post(array(
        'post_type' => 'test_session',
        'post_title' => 'Test Session - User ' . $user_id,
        'post_status' => 'publish',
        'meta_input' => array(
            'user_id' => $user_id,
            'exam_set_id' => $data['exam_set_id'],
            'status' => 'completed',
            'started_at' => $data['started_at'],
            'completed_at' => current_time('mysql'),
            'time_remaining' => $data['time_remaining'],
        )
    ));

    // Save answers and calculate score
    $correct_answers = 0;
    $total_questions = count($data['answers']);

    foreach ($data['answers'] as $question_id => $selected_answer) {
        $correct_answer = get_post_meta($question_id, 'correct_answer', true);
        $is_correct = ($selected_answer == $correct_answer);
        
        if ($is_correct) {
            $correct_answers++;
        }

        // Save answer
        wp_insert_post(array(
            'post_type' => 'test_answer',
            'post_title' => 'Answer - Session ' . $session_id,
            'post_status' => 'publish',
            'meta_input' => array(
                'session_id' => $session_id,
                'question_id' => $question_id,
                'selected_answer' => $selected_answer,
                'is_correct' => $is_correct,
                'answered_at' => current_time('mysql'),
            )
        ));
    }

    // Calculate TCF level and score
    $score_percentage = ($correct_answers / $total_questions) * 100;
    $tcf_score = round(($score_percentage / 100) * 699);
    
    $tcf_level = 'A1';
    if ($tcf_score >= 600) $tcf_level = 'C2';
    elseif ($tcf_score >= 500) $tcf_level = 'C1';
    elseif ($tcf_score >= 400) $tcf_level = 'B2';
    elseif ($tcf_score >= 300) $tcf_level = 'B1';
    elseif ($tcf_score >= 200) $tcf_level = 'A2';

    // Generate certificate number
    $certificate_number = 'TCF-' . date('Y') . '-' . str_pad($user_id, 4, '0', STR_PAD_LEFT) . '-' . str_pad($session_id, 4, '0', STR_PAD_LEFT);

    // Save test result
    $result_id = wp_insert_post(array(
        'post_type' => 'test_result',
        'post_title' => 'Test Result - User ' . $user_id,
        'post_status' => 'publish',
        'meta_input' => array(
            'session_id' => $session_id,
            'user_id' => $user_id,
            'exam_set_id' => $data['exam_set_id'],
            'total_score' => $tcf_score,
            'tcf_level' => $tcf_level,
            'correct_answers' => $correct_answers,
            'total_questions' => $total_questions,
            'completion_time_minutes' => $data['completion_time_minutes'],
            'certificate_number' => $certificate_number,
        )
    ));

    return array(
        'success' => true,
        'result_id' => $result_id,
        'session_id' => $session_id,
        'score' => $tcf_score,
        'level' => $tcf_level,
        'correct_answers' => $correct_answers,
        'total_questions' => $total_questions,
        'certificate_number' => $certificate_number,
    );
}

// Get user test results
function tcf_get_user_results($request) {
    $user_id = $request['user_id'];
    
    $results = get_posts(array(
        'post_type' => 'test_result',
        'posts_per_page' => -1,
        'meta_query' => array(
            array(
                'key' => 'user_id',
                'value' => $user_id,
                'compare' => '='
            )
        ),
        'orderby' => 'date',
        'order' => 'DESC'
    ));

    $formatted_results = array();
    foreach ($results as $result) {
        $meta = get_post_meta($result->ID);
        $formatted_results[] = array(
            'id' => $result->ID,
            'date' => $result->post_date,
            'meta' => array_map(function($value) {
                return maybe_unserialize($value[0]);
            }, $meta)
        );
    }

    return $formatted_results;
}

// Enable JWT Authentication (requires JWT Authentication plugin)
add_filter('jwt_auth_whitelist', function ($endpoints) {
    return array(
        '/wp-json/wp/v2/*',
        '/wp-json/tcf/v1/*',
    );
});
?>