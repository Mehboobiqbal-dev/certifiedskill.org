# Optimizing Serverless Function Size for Vercel Deployment

This document provides guidance on how to optimize the size of serverless functions when deploying to Vercel, addressing the error: "A Serverless Function has exceeded the unzipped maximum size of 250 MB".

## Understanding the Issue

Vercel has a limit of 250MB for unzipped serverless functions. When your function exceeds this limit, the deployment will fail. This is often caused by:

1. Large dependencies in node_modules
2. Including unnecessary files in the function bundle
3. Not properly configuring Next.js for serverless deployment

## Implemented Solutions

The following optimizations have been implemented in this project:

### 1. Dependency Optimization

- **Dependency Pruning Script**: `npm run prune-deps` removes unnecessary files from node_modules before deployment.
- **Separate API Routes**: Heavy dependencies like puppeteer, face-api.js, and pdfkit have been moved to separate API routes to avoid including them in every function.
- **Dynamic Imports**: Using dynamic imports to load dependencies only when needed.

### 2. Next.js Configuration

- **Output File Tracing**: Configured in `next.config.mjs` to exclude large dependencies from the serverless function bundle.
- **Webpack Optimization**: Custom webpack configuration to provide fallbacks for Node.js built-ins.

### 3. Vercel Configuration

- **Function-specific Settings**: The `vercel.json` file includes function-specific configurations for memory, duration, and file exclusions.
- **Route Configuration**: Optimized routing to ensure efficient function execution.

## How to Deploy

1. Run the build command which includes dependency pruning:
   ```
   npm run build
   ```

2. Deploy to Vercel:
   ```
   vercel --prod
   ```

## Additional Optimization Tips

1. **Analyze Bundle Size**: Use tools like `@next/bundle-analyzer` to identify large dependencies.

2. **Use CDNs for Static Assets**: Store and serve large static assets from a CDN instead of including them in your serverless functions.

3. **Consider Edge Functions**: For simple operations, Vercel Edge Functions have fewer size restrictions.

4. **Split Large Functions**: Break down large functions into smaller, more focused ones.

5. **Remove Unused Dependencies**: Regularly audit and remove unused dependencies from your project.

6. **Use Incremental Static Regeneration (ISR)**: When possible, use ISR instead of serverless functions for data fetching.

## Troubleshooting

If you still encounter size issues:

1. Check the Vercel deployment logs to identify which function is exceeding the limit.
2. Look for large dependencies that could be moved to separate functions.
3. Consider refactoring to use more static generation and less server-side rendering.
4. For data scraping operations, consider moving them to a separate microservice or scheduled job.

## Resources

- [Vercel Serverless Functions Documentation](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Optimizing Next.js for Production](https://nextjs.org/docs/going-to-production)