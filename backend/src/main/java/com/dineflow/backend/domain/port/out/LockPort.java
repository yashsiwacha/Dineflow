package com.dineflow.backend.domain.port.out;

public interface LockPort {
    void lock(String key);
    void unlock(String key);
    boolean tryLock(String key, long timeoutMs);
}
