<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class StoreContextMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $storeId = $request->header('X-Store-ID');

        if (!$storeId) {
            return response()->json([
                'message' => 'Missing X-Store-ID header. All requests must specify the target storefront.',
                'error' => 'Unauthorized'
            ], 401);
        }

        // Validate store ID
        $validStores = ['bakery', 'grocery', 'fashion'];
        if (!in_array($storeId, $validStores)) {
            return response()->json([
                'message' => "Invalid X-Store-ID '{$storeId}'.",
                'error' => 'Unauthorized'
            ], 401);
        }

        // Make store context globally available for queries/logging
        app()->instance('store.context', $storeId);
        
        Log::debug("API Request scoped to store: {$storeId}", [
            'url' => $request->fullUrl()
        ]);

        return $next($request);
    }
}
