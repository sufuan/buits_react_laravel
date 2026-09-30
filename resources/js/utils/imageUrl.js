/**
 * Normalize a stored image path to a browser-accessible URL.
 *
 * Legacy/seeded records store paths like:
 *   "public/uploads/certificate/certificate_template.jpg"
 * which live directly inside the /public folder and are accessible at:
 *   "/uploads/certificate/certificate_template.jpg"
 *
 * New uploads (via Storage::disk('public')->store(...)) store paths like:
 *   "certificate/filename.jpg"
 * which are accessible through the storage symlink at:
 *   "/storage/certificate/filename.jpg"
 *
 * @param {string|null} path - The raw path value from the database
 * @returns {string|null} - The browser-accessible URL, or null if path is empty
 */
export function getImageUrl(path) {
    if (!path) return null;

    // Legacy format: stored as "public/something" → strip "public" prefix
    // These files live directly in the Laravel /public directory
    if (path.startsWith('public/')) {
        return '/' + path.slice('public/'.length);
    }

    // New format: stored as "certificate/filename.jpg" (or any relative path)
    // Accessible via the storage symlink: /storage/certificate/filename.jpg
    return `/storage/${path}`;
}
