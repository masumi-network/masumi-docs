var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { promises as fs } from 'fs';
import path from 'path';
var REPOS = [
    {
        owner: 'masumi-network',
        repo: 'agentic-service-wrapper',
        branch: 'docs-prepare',
        outputPath: './content/docs/documentation/get-started/_agentic-service-wrapper.mdx',
        isTabContent: true
    },
    {
        owner: 'masumi-network',
        repo: 'masumi-mcp-server',
        outputPath: './content/docs/documentation/technical-documentation/_masumi-mcp-server.mdx',
        isTabContent: false
    }
];
function fetchReadme(owner_1, repo_1) {
    return __awaiter(this, arguments, void 0, function (owner, repo, branch) {
        var response, error_1;
        if (branch === void 0) { branch = 'main'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://api.github.com/repos/".concat(owner, "/").concat(repo, "/readme?ref=").concat(branch), {
                            headers: {
                                'Accept': 'application/vnd.github.v3.raw',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch README: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.text()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching README for ".concat(owner, "/").concat(repo, " (branch: ").concat(branch, "):"), error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchImage(url, localPath) {
    return __awaiter(this, void 0, void 0, function () {
        var response, buffer, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch image: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.arrayBuffer()];
                case 2:
                    buffer = _a.sent();
                    return [4 /*yield*/, fs.writeFile(localPath, Buffer.from(buffer))];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error fetching image ".concat(url, ":"), error_2);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function syncImages(readmeContent_1, owner_1, repo_1) {
    return __awaiter(this, arguments, void 0, function (readmeContent, owner, repo, branch) {
        var imagesDir, updatedContent, imageRegexes, _i, imageRegexes_1, regex, match, imagePath, cleanPath, githubUrl, fileName, localPath, publicPath, success;
        if (branch === void 0) { branch = 'main'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    imagesDir = "./public/synced-images/".concat(owner, "/").concat(repo);
                    // Ensure images directory exists
                    return [4 /*yield*/, fs.mkdir(imagesDir, { recursive: true })];
                case 1:
                    // Ensure images directory exists
                    _a.sent();
                    updatedContent = readmeContent;
                    imageRegexes = [
                        /!\[[^\]]*\]\(([^)]+)\)/g, // markdown images
                        /<img[^>]+src=["']([^"']+)["'][^>]*>/g, // img tags
                        /<source[^>]+srcset=["']([^"']+)["'][^>]*>/g // source tags with srcset
                    ];
                    _i = 0, imageRegexes_1 = imageRegexes;
                    _a.label = 2;
                case 2:
                    if (!(_i < imageRegexes_1.length)) return [3 /*break*/, 6];
                    regex = imageRegexes_1[_i];
                    match = void 0;
                    _a.label = 3;
                case 3:
                    if (!((match = regex.exec(readmeContent)) !== null)) return [3 /*break*/, 5];
                    imagePath = match[1];
                    // Skip if it's already a full URL
                    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                        return [3 /*break*/, 3];
                    }
                    cleanPath = imagePath.replace(/^\.\//, '');
                    githubUrl = "https://raw.githubusercontent.com/".concat(owner, "/").concat(repo, "/").concat(branch, "/").concat(cleanPath);
                    fileName = path.basename(imagePath);
                    localPath = path.join(imagesDir, fileName);
                    publicPath = "/synced-images/".concat(owner, "/").concat(repo, "/").concat(fileName);
                    // Fetch and save the image
                    console.log("\uD83D\uDCF8 Fetching image: ".concat(githubUrl));
                    return [4 /*yield*/, fetchImage(githubUrl, localPath)];
                case 4:
                    success = _a.sent();
                    if (success) {
                        // Replace the path in content - use global replace to catch all occurrences
                        updatedContent = updatedContent.replaceAll(imagePath, publicPath);
                        console.log("\u2705 Synced image: ".concat(fileName));
                    }
                    else {
                        console.log("\u274C Failed to sync image: ".concat(fileName));
                    }
                    return [3 /*break*/, 3];
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, updatedContent];
            }
        });
    });
}
function parseAttributes(attributesString) {
    var attributes = {};
    var attributeRegex = /([\w-]+)=["']([^"]*)["']/g;
    var match;
    while ((match = attributeRegex.exec(attributesString)) !== null) {
        attributes[match[1]] = match[2];
    }
    return attributes;
}
function convertHtmlToJsx(content) {
    var updatedContent = content;
    // Convert <picture> elements with dark mode variants
    var pictureRegex = /<picture[^>]*>\s*<source[^>]*media=\"\s*\(\s*prefers-color-scheme:\s*dark\s*\)\"[^>]*srcset=\"([^\"]+)\"[^>]*>\s*<img([^>]+)>\s*<\/picture>/gis;
    updatedContent = updatedContent.replace(pictureRegex, function (match, darkSrc, imgTag) {
        var imgAttributes = parseAttributes(imgTag);
        var lightSrc = imgAttributes.src;
        var altText = imgAttributes.alt || '';
        var existingClass = imgAttributes.class || '';
        // Filter out attributes that will be explicitly set or handled
        var sharedAttrs = Object.entries(imgAttributes)
            .filter(function (_a) {
            var key = _a[0];
            return !['src', 'alt', 'class', 'width', 'height'].includes(key);
        })
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "".concat(key, "=\"").concat(value, "\"");
        })
            .join(' ');
        // Note the use of template literals for className to combine existing and new classes
        return "<div>\n      <ImageZoom src=\"".concat(lightSrc, "\" alt=\"").concat(altText, "\" width={1200} height={800} className={`").concat(existingClass, " w-full h-auto block dark:hidden`} ").concat(sharedAttrs, " />\n      <ImageZoom src=\"").concat(darkSrc, "\" alt=\"").concat(altText, "\" width={1200} height={800} className={`").concat(existingClass, " w-full h-auto hidden dark:block`} ").concat(sharedAttrs, " />\n    </div>");
    });
    // Convert standalone <img> tags
    var imgRegex = /<img([^>]+)>/gi;
    updatedContent = updatedContent.replace(imgRegex, function (match, attributesString) {
        // If the img tag is inside a div that we just created, skip it.
        if (match.includes('dark:hidden') || match.includes('hidden dark:block')) {
            return match;
        }
        var attributes = parseAttributes(attributesString);
        var isGif = attributes.src && attributes.src.toLowerCase().endsWith('.gif');
        var Component = isGif ? 'img' : 'ImageZoom';
        var existingClass = attributes.class || '';
        // Filter out attributes that will be explicitly set or handled
        var attrsForJsx = Object.entries(attributes)
            .filter(function (_a) {
            var key = _a[0];
            return !['class', 'width', 'height'].includes(key);
        })
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            var jsxKey = key === 'class' ? 'className' : key;
            return "".concat(jsxKey, "=\"").concat(value, "\"");
        }).join(' ');
        return "<".concat(Component, " ").concat(attrsForJsx, " width={1200} height={800} className={`").concat(existingClass, " w-full h-auto`} />");
    });
    // Convert common HTML attributes to JSX equivalents
    var attributeMap = {
        'srcset': 'srcSet',
        'crossorigin': 'crossOrigin',
        'tabindex': 'tabIndex',
        'readonly': 'readOnly',
        'maxlength': 'maxLength',
        'cellpadding': 'cellPadding',
        'cellspacing': 'cellSpacing',
        'rowspan': 'rowSpan',
        'colspan': 'colSpan',
        'usemap': 'useMap',
        'frameborder': 'frameBorder',
        'contenteditable': 'contentEditable',
        'spellcheck': 'spellCheck'
    };
    for (var _i = 0, _a = Object.entries(attributeMap); _i < _a.length; _i++) {
        var _b = _a[_i], htmlAttr = _b[0], jsxAttr = _b[1];
        var regex = new RegExp("\\b".concat(htmlAttr, "="), 'gi');
        updatedContent = updatedContent.replace(regex, "".concat(jsxAttr, "="));
    }
    return updatedContent;
}
function convertReadmeToTabContent(readmeContent, owner, repo, branch) {
    // Add callout with repository link
    var branchInfo = branch && branch !== 'main' && branch !== 'master' ? " (branch: ".concat(branch, ")") : '';
    var callout = "<Callout type=\"info\">\n  This content is automatically synced from the <a href=\"https://github.com/".concat(owner, "/").concat(repo, "\" target=\"_blank\" rel=\"noopener noreferrer\">").concat(owner, "/").concat(repo, "</a>").concat(branchInfo, " repository.\n</Callout>\n\n");
    return callout + readmeContent;
}
function generateReadmePages() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, REPOS_1, _a, owner, repo, branch, outputPath, isTabContent, readmeContent, contentWithSyncedImages, contentWithJsxAttributes, fullContent, title, frontmatter, processedContent, branchInfo, title, frontmatter, dir;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('📚 Fetching README files...');
                    _i = 0, REPOS_1 = REPOS;
                    _b.label = 1;
                case 1:
                    if (!(_i < REPOS_1.length)) return [3 /*break*/, 7];
                    _a = REPOS_1[_i], owner = _a.owner, repo = _a.repo, branch = _a.branch, outputPath = _a.outputPath, isTabContent = _a.isTabContent;
                    console.log("Fetching ".concat(owner, "/").concat(repo, " (branch: ").concat(branch || 'main', ")..."));
                    return [4 /*yield*/, fetchReadme(owner, repo, branch)];
                case 2:
                    readmeContent = _b.sent();
                    if (!readmeContent) {
                        console.error("\u274C Failed to fetch README for ".concat(owner, "/").concat(repo));
                        return [3 /*break*/, 6];
                    }
                    // Sync images and update paths
                    console.log("\uD83D\uDCF8 Syncing images for ".concat(owner, "/").concat(repo, "..."));
                    return [4 /*yield*/, syncImages(readmeContent, owner, repo, branch)];
                case 3:
                    contentWithSyncedImages = _b.sent();
                    // Convert HTML attributes to JSX
                    console.log("\uD83D\uDD04 Converting HTML to JSX for ".concat(owner, "/").concat(repo, "..."));
                    contentWithJsxAttributes = convertHtmlToJsx(contentWithSyncedImages);
                    fullContent = void 0;
                    if (isTabContent) {
                        title = repo.split('-').map(function (word) {
                            return word.charAt(0).toUpperCase() + word.slice(1);
                        }).join(' ').replace(/\bMcp\b/g, 'MCP');
                        frontmatter = "---\ntitle: ".concat(title, "\ndescription: Content from ").concat(owner, "/").concat(repo, " repository\n---\n\nimport { Callout } from 'fumadocs-ui/components/callout';\nimport { ImageZoom } from 'fumadocs-ui/components/image-zoom';\n\n");
                        processedContent = convertReadmeToTabContent(contentWithJsxAttributes, owner, repo, branch || 'main');
                        fullContent = frontmatter + processedContent;
                    }
                    else {
                        branchInfo = branch && branch !== 'main' && branch !== 'master' ? " (branch: ".concat(branch, ")") : '';
                        title = repo.split('-').map(function (word) {
                            return word.charAt(0).toUpperCase() + word.slice(1);
                        }).join(' ').replace(/\bMcp\b/g, 'MCP');
                        frontmatter = "---\ntitle: ".concat(title, "\n---\n\nimport { Callout } from 'fumadocs-ui/components/callout';\nimport { ImageZoom } from 'fumadocs-ui/components/image-zoom';\n\n<Callout type=\"info\">\n  This page is automatically synced from the <a href=\"https://github.com/").concat(owner, "/").concat(repo, "\" target=\"_blank\" rel=\"noopener noreferrer\">").concat(owner, "/").concat(repo, "</a>").concat(branchInfo, " repository README.\n</Callout>\n\n");
                        fullContent = frontmatter + contentWithJsxAttributes;
                    }
                    dir = path.dirname(outputPath);
                    return [4 /*yield*/, fs.mkdir(dir, { recursive: true })];
                case 4:
                    _b.sent();
                    // Write the file
                    return [4 /*yield*/, fs.writeFile(outputPath, fullContent)];
                case 5:
                    // Write the file
                    _b.sent();
                    console.log("\u2705 Generated ".concat(outputPath));
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log('✅ All README files fetched successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
await generateReadmePages().catch(function (e) {
    console.error('Failed to fetch README files', e);
});
