package com.omnipost.composer.exception;

public class WordLimitExceededException extends RuntimeException {

    public WordLimitExceededException(String message) {
        super(message);
    }
}
