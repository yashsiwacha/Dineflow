package com.dineflow.backend.infrastructure.lock;

import com.dineflow.backend.domain.port.out.LockPort;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

@Component
public class LocalLockAdapter implements LockPort {

    private final ConcurrentHashMap<String, ReentrantLock> locks = new ConcurrentHashMap<>();

    @Override
    public void lock(String key) {
        locks.computeIfAbsent(key, k -> new ReentrantLock()).lock();
    }

    @Override
    public void unlock(String key) {
        ReentrantLock lock = locks.get(key);
        if (lock != null && lock.isHeldByCurrentThread()) {
            lock.unlock();
        }
    }

    @Override
    public boolean tryLock(String key, long timeoutMs) {
        try {
            return locks.computeIfAbsent(key, k -> new ReentrantLock())
                    .tryLock(timeoutMs, TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
}
