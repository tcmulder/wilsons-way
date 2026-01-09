<?php
/**
 * Reusable utility functions
 */

/**
 * Wrap a message in a message box.
 * 
 * @param string $name    Name of the message (can be used for CSS styling)
 * @param string $message Message to display (allows some basic HTML)
 * @param string $controls Controls to display if any (HTML)
 * @return string HTML for the message box
 */
function cq_message( $name, $message, $controls = '' ) {
    if ( $controls ) {
        $controls = sprintf(
            '<div class="sr-message-controls">%s</div>',
            $controls
        );
    }
    return sprintf(
        '<div class="sr-message" data-message="%s" data-message-has-type>
            <div class="sr-message-quote">
                <div class="sr-message-scroller">
                    <div class="sr-message-type">%s</div>
                    %s
                </div>
            </div>
        </div>',
        $name,
        $message,
        $controls
    );
} 

/**
 * Parse HTML with only what we care about.
 * 
 * @param string $message Message to parse in HTML
 * @return string Parsed HTML
 */
function cq_wp_kses( $message ) {
    return wp_kses(
        $message,
        array(
            'a'      => array(
                'href'   => array(),
                'target' => array()
            ),
            'br'     => array(),
            'em'     => array(),
            'strong' => array(),
            'p'      => array(),
            'ul'     => array(),
            'ol'     => array(),
            'li'     => array(),
        )
    );
}