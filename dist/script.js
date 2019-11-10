/*
 * Appi 1.0
 * Sponsored by: roombelt.com
 * Documentation: https://github.com/ziolko/appi
 * License: Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */

// Configure authentication keys based on the examples below:

// Example 1: Admin account that has read/write access to all sheets
// User("admin", "Ch4ng3me!", ALL);

// Example 2: User account that can add entries to a "transactions" sheet
// User("user", "Passw0rd!", { transactions: POST });

// Example 3: User account that can add entries to a "transactions" sheet and read from "summary" sheet
// User("user", "Passw0rd!", { transactions: POST, summary: GET });

// Example 4:  Anonymous account that has read access to a specified sheet
// User("anonymous", UNSAFE(""), { transactions: GET });

// Example 5: Anonymous account that has read/write access to all sheets - NOT RECOMMENDED!
// User("anonymous", UNSAFE(""), ALL);

// Example 6: Anonymous account that has read access to all sheets - NOT RECOMMENDED!
// User("anonymous", UNSAFE(""), GET);

/**
 * @OnlyCurrentDoc
 */
var users,__assign=this&&this.__assign||function(){return(__assign=Object.assign||function(r){for(var t,e=1,n=arguments.length;e<n;e++)for(var a in t=arguments[e])Object.prototype.hasOwnProperty.call(t,a)&&(r[a]=t[a]);return r}).apply(this,arguments)};function error(r,t,e){return{status:r,error:{code:t,details:e}}}function data(r,t,e){return void 0===t&&(t=void 0),void 0===e&&(e={}),__assign(__assign({status:r},e),{data:t})}function get(r,t,e){var n=r.getLastColumn(),a=r.getRange(1,1,1,n).getValues()[0].filter(function(r){return""!==r}),i=function(r,t){if(a.every(function(t,e){return""===r[e]||null==r[e]}))return null;for(var e={_id:t},n=0;n<a.length;n++)e[a[n]]=r[n];return e};if(null!=t){var o=r.getRange(t,1,1,n).getValues()[0],u=i(o,t);return u?data(200,u):error(404,"row_not_found",{_id:t})}var s=r.getLastRow(),f=Math.max(s-2+1,0),c=null!=e.limit?+e.limit:f,l="string"!=typeof e.order||"desc"!==e.order.toLowerCase();if(isNaN(c)||c<0)return error(404,"invalid_limit",{limit:c});var d=l?2:s-c+1;if(null!=e.start_id){var p=+e.start_id;if(p<2||p>s)return error(404,"start_id_out_of_range",{start_id:p});d=p-(l?0:c-1)}var g=Math.min(d+c-1,s),h=[];(d=Math.max(d,2))<=g&&(h=r.getRange(d,1,g-d+1,n).getValues().map(function(r,t){return i(r,d+t)})),l||h.reverse();var m=l?g+1:d-1;return(m<2||m>s)&&(m=void 0),data(200,h.filter(function(r){return r}),{next:m})}function post(r,t){var e=r.getLastColumn(),n=r.getRange(1,1,1,e).getValues()[0].filter(function(r){return""!=r}).map(function(r){return void 0===t[r]?"":t[r]});return r.appendRow(n),data(201)}function del(r,t){return r.getRange(t+":"+t).setValue(""),data(204)}function put(r,t,e){if(null==t)return error(400,"row_id_missing",{});var n=r.getLastColumn(),a=r.getRange(1,1,1,n).getValues()[0].filter(function(r){return""!=r}).map(function(r){return void 0===e[r]?"":e[r]});return r.getRange(t,1,1,n).setValues([a]),data(201)}function handleRequest(r){var t=SpreadsheetApp.getActiveSpreadsheet(),e=(r.path||"").match(/^\/?(\w+)(\/(\d+)\/?)?$/);if(!e)return error(404,"Invalid path format",{path:r.path});var n=(e[1]||"").toLowerCase(),a=null==e[3]?null:+e[3],i=(r.method||"GET").toUpperCase(),o=r.key||"";if(!hasAccess(o,n,i))return error(401,"unauthorized",{});if(!isStrongKey(o))return error(401,"weak_key",{message:"Authentication key should be at least 8 characters long and contain at least one lower case, upper case, number and special character. Update your password or mark it as UNSAFE. Refer to the documentation for details."});var u=t.getSheetByName(n);if(!u)return error(404,"sheet_not_found",{sheet:n});if(null!=a&&a<=1)return error(400,"row_index_invalid",{_id:a});var s=r.payload;switch(i){case"GET":return get(u,a,r);case"POST":return post(u,s);case"PUT":return put(u,a,s);case"DELETE":return del(u,a);default:return error(404,"unknown_method",{method:i})}}function res(r){return ContentService.createTextOutput(JSON.stringify(r))}function doGet(r){if(r.parameter.payload)try{r.parameter.payload=JSON.parse(r.parameter.payload)}catch(t){return error(400,"payload_invalid_json",r.parameter.payload)}return res(handleRequest(r.parameter))}function doPost(r){var t;try{t=JSON.parse(r.postData.contents)}catch(t){return error(400,"invalid_post_payload",{payload:r.postData.contents})}return Array.isArray(t)?res(t.map(handleRequest)):res(handleRequest(t))}function User(r,t,e){users||(users=[]),users.push({name:r,key:t,permissions:e})}function find(r,t){if(Array.isArray(r))for(var e=0;e<r.length;e++)if(t(r[e]))return r[e]}function getUserWithKey(r){return find(users,function(t){return t.key===r||"object"==typeof t&&t.key.__unsafe===r})}function isStrongKey(r){var t=new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"),e=getUserWithKey(r);return!!e&&(e.key.__unsafe===r||e.key.match(t))}function getPermissions(r,t){return Array.isArray(r.permissions)?r.permissions:"function"==typeof r.permissions?r.permissions:r.permissions[t]||r.permissions.ALL}function hasAccess(r,t,e){var n=getUserWithKey(r);if(!n)return!1;var a=getPermissions(n,t);return!!a&&!(a!==ALL&&a.toString()!==e&&!find(a,function(r){return r===ALL})&&!find(a,function(r){return r.toString()===e}))}function GET(){}function POST(){}function PUT(){}function DELETE(){}function ALL(){}function UNSAFE(r){return{__unsafe:r}}GET.toString=function(){return"GET"},POST.toString=function(){return"POST"},PUT.toString=function(){return"PUT"},DELETE.toString=function(){return"DELETE"},ALL.toString=function(){return"*"};

/*
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */