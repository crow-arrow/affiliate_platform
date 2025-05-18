<?php
/*
Plugin Name: Affiliate Tracking for Tourmaster
Description: Добавляет отслеживание аффилиатов для системы бронирования Tourmaster.
Version: 1.1
Author: Jinn Travel
*/

if (!defined('ABSPATH')) {
    exit;
}

// Проверка, чтобы плагин не дублировался
if (!defined('AFFILIATE_TRACKING_PLUGIN_LOADED')) {
    define('AFFILIATE_TRACKING_PLUGIN_LOADED', true);

    add_action('admin_menu', 'affiliate_add_admin_menu');

    // Подключение файла с функциями
    require_once plugin_dir_path(__FILE__) . 'includes/affiliate-functions.php';

    // Добавление страницы в меню администратора
    function affiliate_add_admin_menu() {
        // Главная страница меню
        add_menu_page(
            'Управление аффилиатами', // Заголовок страницы
            'Affiliate', // Название меню
            'manage_options', // Права доступа
            'affiliate_management', // Слаг меню
            'affiliate_management_page', // Функция отображения страницы
            'dashicons-admin-users', // Иконка
            20 // Позиция в меню
        );

        // Подменю для добавления аффилиата
        add_submenu_page(
            'affiliate_management', // Родительский слаг
            'Add affiliate', // Заголовок страницы подменю
            'Add affiliate', // Название подменю
            'manage_options', // Права доступа
            'affiliate_add', // Слаг подменю
            'affiliate_add_page_callback' // Функция отображения страницы подменю
        );

        // Подменю для просмотра статистики
        add_submenu_page(
            'affiliate_management',
            'Affiliate Statistics',
            'Statistics',
            'manage_options',
            'affiliate_statistics',
            'affiliate_statistics_page'
        );
    }

    // Страница управления аффилиатами
    function affiliate_management_page() {
        ?>
        <div class="wrap">
            <h1>Affiliate Management</h1>
            <table class="wp-list-table widefat fixed striped posts">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Affiliate ID</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    global $wpdb;
                    $affiliates_table_name = $wpdb->prefix . 'affiliates';
                    $affiliates = $wpdb->get_results("SELECT * FROM $affiliates_table_name");
                    foreach ($affiliates as $affiliate) {
                        echo '<tr>';
                        echo '<td>' . esc_html($affiliate->name) . '</td>';
                        echo '<td>' . esc_html($affiliate->email) . '</td>';
                        echo '<td>' . esc_html($affiliate->affiliate_id) . '</td>';
                        echo '</tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    // Страница для добавления нового аффилиата
    function affiliate_add_page_callback() {
        ?>
        <div class="wrap">
            <h1>Add Affiliate</h1>
            <form method="post" action="">
                <table class="form-table">
                    <tr>
                        <th><label for="affiliate_name">Name</label></th>
                        <td><input type="text" id="affiliate_name" name="affiliate_name" required /></td>
                    </tr>
                    <tr>
                        <th><label for="affiliate_email">Email</label></th>
                        <td><input type="email" id="affiliate_email" name="affiliate_email" required /></td>
                    </tr>
                </table>
                <input type="submit" name="add_affiliate" value="Add" class="button-primary" />
            </form>
        </div>
        <?php
        if (isset($_POST['add_affiliate'])) {
            global $wpdb;
            
            $name = sanitize_text_field($_POST['affiliate_name']);
            $email = sanitize_email($_POST['affiliate_email']);
            
            // Генерация affiliate_id на основе имени + случайные цифры
            $random_number = mt_rand(100, 999);
            $affiliate_id = strtolower(str_replace(' ', '_', $name)) . "_" . $random_number;
    
            // Вставка в базу данных
            $table_name = $wpdb->prefix . 'affiliates';
            $wpdb->insert($table_name, [
                'name' => $name,
                'email' => $email,
                'affiliate_id' => $affiliate_id
            ]);

            // Установка куки после добавления аффилиата
            set_affiliate_cookie($affiliate_id);

            echo '<div class="updated"><p>Affiliate added successfully!</p></div>';
        }
    }

    // Страница для отображения статистики аффилиатов
    function affiliate_statistics_page() {
        ?>
        <div class="wrap">
            <h1>Affiliate Statistics</h1>
            <table class="wp-list-table widefat fixed striped posts">
                <thead>
                    <tr>
                        <th>Affiliate ID</th>
                        <th>Timestamp</th>
                        <th>IP Address</th>
                        <th>User Agent</th>
                        <th>Referrer</th>
                        <th>Is Unique</th>
                        <th>Country</th>
                        <th>City</th>
                        <th>Device Type</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    global $wpdb;
                    $analytics_table_name = $wpdb->prefix . 'referral_link_analytic';
                    $results = $wpdb->get_results("SELECT * FROM $analytics_table_name");
                    foreach ($results as $row) {
                        echo '<tr>';
                        echo '<td>' . esc_html($row->affiliate_id) . '</td>';
                        echo '<td>' . esc_html($row->timestamp) . '</td>';
                        echo '<td>' . esc_html($row->ip_address) . '</td>';
                        echo '<td>' . esc_html($row->user_agent) . '</td>';
                        echo '<td>' . esc_html($row->referrer) . '</td>';
                        echo '<td>' . ($row->is_unique ? 'Yes' : 'No') . '</td>';
                        echo '<td>' . esc_html($row->country) . '</td>';
                        echo '<td>' . esc_html($row->city) . '</td>';
                        echo '<td>' . esc_html($row->device_type) . '</td>';
                        echo '</tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    // Функция для записи статистики перехода
    function log_referral_click($affiliate_id) {
        error_log("📝 log_referral_click() вызвана с affiliate_id = $affiliate_id");
    
        global $wpdb;
        $analytics_table_name = $wpdb->prefix . 'referral_link_analytic';
    
        $ip_address = $_SERVER['REMOTE_ADDR'];
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $referrer = isset($_SERVER['HTTP_REFERER']) ? sanitize_url($_SERVER['HTTP_REFERER']) : '';
        $timestamp = current_time('mysql');
    
        // Проверка уникальности
        $twenty_four_hours_ago = date('Y-m-d H:i:s', strtotime('-24 hours'));
        $is_unique = !$wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $analytics_table_name 
                WHERE affiliate_id = %s AND ip_address = %s AND timestamp >= %s",
            $affiliate_id, $ip_address, $twenty_four_hours_ago
        ));
        error_log("🧠 Уникальный клик: " . ($is_unique ? "ДА" : "НЕТ"));
    
        // Геолокация
        $country = 'Unknown';
        $city = 'Unknown';
        try {
            $geo_data = unserialize(file_get_contents("http://ip-api.com/php/$ip_address"));
            if ($geo_data && $geo_data['status'] == 'success') {
                $country = sanitize_text_field($geo_data['country']);
                $city = sanitize_text_field($geo_data['city']);
            }
            error_log("🌍 Геолокация: $country, $city");
        } catch (Exception $e) {
            error_log("❌ Ошибка при получении геоданных: " . $e->getMessage());
        }
    
        // Тип устройства
        if (strpos($user_agent, 'Mobile')) {
            $device_type = 'Mobile';
        } elseif (strpos($user_agent, 'Tablet')) {
            $device_type = 'Tablet';
        } else {
            $device_type = 'Desktop';
        }
        error_log("💻 Тип устройства: $device_type");
    
        // Сохраняем в БД
        $insert_result = $wpdb->insert(
            $analytics_table_name,
            [
                'affiliate_id' => $affiliate_id,
                'timestamp' => $timestamp,
                'ip_address' => $ip_address,
                'user_agent' => $user_agent,
                'referrer' => $referrer,
                'is_unique' => $is_unique,
                'country' => $country,
                'city' => $city,
                'device_type' => $device_type,
            ],
            [
                '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s'
            ]
        );
    
        if ($insert_result === false) {
            error_log("❌ Ошибка вставки в БД: " . $wpdb->last_error);
        } else {
            error_log("✅ Успешно записан клик в БД для affiliate_id: $affiliate_id");
        }
    }

    // Хук активации плагина (создание таблицы аффилиатов)
    register_activation_hook(__FILE__, 'affiliate_create_table');

    // Хук активации плагина (создание таблиц)
    function affiliate_create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        // Таблица для аффилиатов
        $affiliates_table_name = $wpdb->prefix . 'affiliates';
        $affiliates_sql = "CREATE TABLE $affiliates_table_name (
            id BIGINT(20) NOT NULL AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            affiliate_id VARCHAR(255) NOT NULL UNIQUE,
            PRIMARY KEY (id)
        ) $charset_collate;";

        // Таблица для аналитики переходов
        $analytics_table_name = $wpdb->prefix . 'referral_link_analytic';
        $analytics_sql = "CREATE TABLE $analytics_table_name (
            id BIGINT(20) NOT NULL AUTO_INCREMENT,
            affiliate_id VARCHAR(255) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45) NOT NULL,
            user_agent TEXT NOT NULL,
            referrer TEXT,
            is_unique BOOLEAN DEFAULT FALSE,
            country VARCHAR(255),
            city VARCHAR(255),
            device_type VARCHAR(50),
            PRIMARY KEY (id),
            INDEX (affiliate_id),
            INDEX (timestamp)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($affiliates_sql);
        dbDelta($analytics_sql);
    }
}
?>