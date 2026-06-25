<?php

if (! function_exists('mb_split')) {
    /**
     * Minimal fallback for environments where ext-mbstring is unavailable.
     *
     * Laravel uses mb_split() internally for StudlyCase conversion during
     * manager driver resolution. This fallback preserves that behavior well
     * enough for ASCII driver names such as "database", "file", and "redis".
     */
    function mb_split(string $pattern, string $string, int $limit = -1): array|false
    {
        $delimiter = '/';
        $escapedPattern = str_replace($delimiter, '\\'.$delimiter, $pattern);
        $regex = $delimiter.$escapedPattern.$delimiter.'u';

        $result = preg_split($regex, $string, $limit);

        return $result === false ? false : $result;
    }
}
