package com.omnipost.composer.model;

/**
 * Supported social platforms and their maximum word limits.
 * Matches the "Select Platform" dropdown in the OmniPost Composer UI.
 */
public enum Platform {
    TWITTER(50),
    INSTAGRAM(150),
    FACEBOOK(200),
    LINKEDIN(300);

    private final int wordLimit;

    Platform(int wordLimit) {
        this.wordLimit = wordLimit;
    }

    public int getWordLimit() {
        return wordLimit;
    }
}
