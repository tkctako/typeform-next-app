/**
 * @swagger
 * /api/get-score/{responseId}:
 *   get:
 *     tags:
 *       - Score Calculation
 *     summary: 根據 Typeform Response ID 計算寵物健康分數
 *     description: 透過 Typeform Response ID 獲取問卷回答，並根據預設權重計算九大健康項目分數
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Typeform Response ID
 *         example: "ugplskupcpikn8xvlougpl1f2vlqonr1"
 *     responses:
 *       200:
 *         description: 分數計算成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetScoreResponse'
 *       400:
 *         description: 缺少必要參數
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 找不到對應的問卷資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 伺服器內部錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   options:
 *     tags:
 *       - Score Calculation
 *     summary: CORS preflight request
 *     description: Handle CORS preflight requests for the get-score endpoint
 *     responses:
 *       200:
 *         description: CORS headers returned successfully
 */

import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Typeform 問題權重暫存資料
const answerWeights = {
  // OCx06HNqyfRR: 汪星人的年齡？
  "OCx06HNqyfRR": {
    "adaMMgQ3fX5S": { 腸胃: 0.5, 關節: 0.5 }, // 幼年期 (Puppy) 0–1歲
    "2IaNT2GvJaJb": {}, // 成年期 (Adult) 1–5歲
    "Fn2DaBphk5Sw": { 腸胃: 0.5, 關節: 0.5 }, // 中年期 (Mature) 6–8歲
    "Kd5iKQLGPHaL": { 腸胃: 1, 關節: 0.5, 心血管: 1 }, // 高齡期 (Senior) 9–11歲
    "47ko9YQ9Yyz9": { 關節: 0.5 } // 超高齡期 (Geriatric) 12歲以上
  },
  // SCSofQklMIXT: 喵星人的年齡？
  "SCSofQklMIXT": {
    "UkhzVUNnom8B": { 腸胃: 0.5, 關節: 0.5 }, // 幼貓期 (Kitten) 0–6個月
    "kprrRnqY5Vzs": { 關節: 0.5 }, // 少年期 (Junior) 7個月–2歲
    "ThosSaaZuUma": {}, // 成年期 (Adult) 3–6歲
    "CpAjOAXCddJV": { 腸胃: 0.5, 關節: 0.5 }, // 中年期 (Mature) 7–10歲
    "mMjLLjIcYTLf": { 腸胃: 1, 關節: 0.5, 心血管: 1 }, // 高齡期 (Senior) 11–14歲
    "ABSo6J9HszJh": {} // 超高齡期 (Geriatric) 15歲以上
  },
  // GI8YbuaWP81M: 您覺得寶貝的目前的體態狀況如何呢？
  "GI8YbuaWP81M": {
    "5XgF6JlEAnQn": { 腸胃: 1, 體重: 0.5 }, // 過瘦（肋骨明顯、缺乏脂肪）
    "ly2SpwM1p4BJ": { 腸胃: 0.5 }, // 偏瘦（比理想體態略瘦一點）
    "quvu6MJeqAKp": {}, // 正常（體態勻稱、活動自如）
    "UITkWQnZtcFK": { 體重: 0.5, 關節: 0.5, 心血管: 0.5 }, // 偏胖（肚子稍圓、走路沉重）
    "afjFZ8yt6TXI": { 體重: 1, 關節: 1, 心血管: 1 } // 過胖（肚子明顯突出、活動力下降）
  },
  // 88gYqTMhGMYt: 寶貝是否已結紮
  "88gYqTMhGMYt": {
    "3Gnyce6aS6jm": { 體重: 1, 情緒: 0.5, 免疫: 1 }, // 已結紮
    "7JfAXMaGDvjU": { 體重: 0.5, 免疫: 1, 情緒: 0.5 } // 未結紮
  },
  // tY25d8xW6avl: 汪星人平常的居住環境
  "tY25d8xW6avl": {
    "rJC1DJi58vSV": { 情緒: 1, 免疫: 1, 體重: 1 }, // 完全室內
    "jOJSVonvul2F": { 體重: 0.5, 免疫: 0.5, 體重: 1 }, // 室內為主，偶爾外出
    "G42RwCUdbwRu": { 情緒: 1, 免疫: 0.5, 皮毛: 0.5 }, // 半戶外（陽台/院子）
    "jt3fkX6JTnr4": { 情緒: 1, 免疫: 1 } // 完全戶外
  },
  // AchHFVv83TGg: 喵星人平常的居住環境
  "AchHFVv83TGg": {
    "8Rf8pC5cHkF5": { 情緒: 1, 免疫: 1, 體重: 1 }, // 理想環境：室內空間寬敞、通風良好、有日照、環境安靜，有跳台與豐富刺激（玩具、攀爬區等）
    "JfJSRQCqW5Vi": { 體重: 0.5, 免疫: 0.5, 體重: 1 }, // 一般室內：室內空間中等，有日照與通風但缺乏豐富刺激（如少玩具或無跳台
    "sLAkWM6c48X9": { 情緒: 1, 免疫: 0.5, 皮毛: 0.5 }, // 壓力環境：空間狹小或環境吵雜（如家中有幼童、噪音多、頻繁被打擾）
    "y8z58cmthAhB": { 皮毛: 0.5 }, // 潮濕陰暗環境：通風不良、日照不足、濕氣重、空氣品質差
    "tHPSTwA34N2X": { 情緒: 1, 免疫: 1 } // 半戶外自由活動：有窗台/陽台/庭院自由活動空間，活動豐富但有病原風險
  },
  // mk6h7aF3rC00: 室內環境中是否使用冷氣
  "mk6h7aF3rC00": {
    "bdyF2jS5ZsWo": { 皮毛: 0.5 }, // 經常，幾乎全天候
    "eaUgvvkv524G": { 皮毛: 1 }, // 部分時間，例如夏季高溫時
    "JB9cqDMKJmaV": { 皮毛: 1 } // 很少或從不使用冷氣
  },
  // 1UzCL5ETzB5H: 您想為寶貝保健的方向（可複選）
  "1UzCL5ETzB5H": {
    "jMYe5GBARt1X": { 腸胃: 1 }, // 腸胃保健
    "tIau2JJ4RpHF": { 關節: 1 }, // 關節保健
    "6yl6IFFCAlvG": { 泌尿: 1 }, // 泌尿保健
    "jptjSeSKlfv4": { 皮毛: 1 }, // 皮毛保健
    "RKxGfqxfG8v3": { 情緒: 1 }, // 情緒穩定
    "IM0klsuRoJtO": { 體重: 1 }, // 體重管理
    "cq3CJ6v7WnqP": { 心血管: 1 }, // 心血管保健
    "5RyipJFpirpU": { 眼睛: 1 }, // 眼睛保健
    "KaaCibx6C25g": { 免疫: 1 }, // 免疫支持
    "1x9N3FB1NACp": {} // 不確定，想依AI系統推薦
  },
  // nlq7BhnfT0ku: 寶貝是否會出現吃太快、吐食或反芻的狀況？
  "nlq7BhnfT0ku": {
    "W1pIwpMv9lIC": {}, // 沒有
    "xWDqurGuCy3z": { 腸胃: 0.5 }, // 偶爾發生
    "EeqMsmHDL9Qa": { 腸胃: 1 } // 經常發生
  },
  // wEdniu8bfauh: 寶貝是否常有脹氣、放屁、打嗝等消化不良狀況？
  "wEdniu8bfauh": {
    "Y5P2IDN5MYZy": {}, // 幾乎沒有
    "SFQwJlV12YZC": { 腸胃: 0.5 }, // 偶爾會
    "BiV5sFAW3IK4": { 腸胃: 1 } // 經常發生，且影響活動
  },
  // 89WHqMK74Inu: 寶貝的排便情況是否正常？
  "89WHqMK74Inu": {
    "4TXl83a6tk0q": {}, // 很規律、成形漂亮
    "3BuytdNtNkmW": { 腸胃: 0.5 }, // 偶爾軟便或便秘
    "qfrxFdLyM5cQ": { 腸胃: 1 } // 經常軟便、便秘或排便異常
  },
  // QeyXYG84fBAJ: 寶貝在休息後剛起身時是否顯得僵硬或慢動作？
  "QeyXYG84fBAJ": {
    "uJI46vXQkvJE": {}, // 起身迅速
    "t4r9ExWIMh7U": { 關節: 0.5 }, // 偶爾顯得卡卡的
    "8ZFbQuryuRRa": { 關節: 1 } // 常常剛起身很僵硬
  },
  // 91OSxmpo85Uj: 寶貝在日常走路時是否會出現跛腳、僵硬或異常步態？
  "91OSxmpo85Uj": {
    "is20JbZsOAf8": {}, // 步態正常
    "QbIfTufuVRoD": { 關節: 0.5 }, // 偶爾步伐怪異
    "yVxJtp60FPGo": { 關節: 1 } // 常常步伐不順、有跛腳情況
  },
  // 5mchUhmMmXM7: 寶貝在跑動、上下樓梯、跳上沙發或床時是否吃力？
  "5mchUhmMmXM7": {
    "I2vq2Erh7KdH": {}, // 很靈活、毫無問題
    "83S2BDOSYmzZ": { 關節: 0.5 }, // 有點吃力或有時不願跳
    "LbbKVcMf0jlI": { 關節: 1 } // 很明顯吃力或完全不跳躍
  },
  // s1KOSBz6vdnO: 寶貝是否有頻尿、少量多次或憋尿情況？
  "s1KOSBz6vdnO": {
    "cjgltfKcIxNz": {}, // 排尿正常
    "2TN8lSe3zBt3": { 泌尿: 0.5 }, // 偶爾頻尿或憋尿
    "4Umh3zgiQua7": { 泌尿: 1 } // 經常頻尿或排尿異常
  },
  // PtdgJjgNpdtB: 寶貝排尿時是否有表現出掙扎、不舒服或呻吟？
  "PtdgJjgNpdtB": {
    "HneX2XmbpQWv": {}, // 沒有異常行為
    "8w5fEjwf68IY": { 泌尿: 0.5 }, // 偶爾出現不舒服表情
    "zKXXNRWdObK1": { 泌尿: 1 } // 排尿時常明顯不適
  },
  // sO4FEv98o185: 寶貝的尿液是否曾有異常氣味、顏色混濁或含血？
  "sO4FEv98o185": {
    "57ahifVZmuzP": {}, // 尿液正常
    "vz5uAJdwQM9g": { 泌尿: 1 }, // 曾出現異常氣味/顏色
    "NSDBgU6tWFnP": { 泌尿: 2 } // 經常混濁、有血、臭味重
  },
  // 4zzJeQugKs4U: 寶貝是否有明顯掉毛、毛髮粗糙或稀疏？
  "4zzJeQugKs4U": {
    "hRHAaPsQ7619": {}, // 毛髮柔順且濃密
    "26KsSa2zKbiM": { 皮毛: 0.5 }, // 有些毛粗或毛量減少
    "BfL3xPTRF4aG": { 皮毛: 1 } // 掉毛嚴重或毛髮稀疏乾燥
  },
  // 1qvmwgeRsX7i: 是否經常看到寶貝抓癢、舔毛或咬皮膚？
  "1qvmwgeRsX7i": {
    "J5u1DQBoW2Q9": {}, // 幾乎不會
    "lWnfgVT9Y8fZ": { 皮毛: 0.5 }, // 偶爾抓癢或舔毛
    "yMCsuKuwkhl9": { 皮毛: 1 } // 經常抓癢或舔毛到脫毛
  },
  // i7lGuJjpCk2U: 是否曾出現紅疹、皮屑、異味或皮膚異常？
  "i7lGuJjpCk2U": {
    "oHHUtgyv2PZW": {}, // 皮膚乾淨無異常
    "hLjx2qICRfUq": { 皮毛: 0.5 }, // 偶爾有皮屑或異味
    "xgwHuf5Mmyj6": { 皮毛: 1 } // 經常出現紅疹、皮屑、皮膚問題
  },
  // TZRZLsJRKZgg: 寶貝在獨處時，是否容易出現不安或異常行為？
  "TZRZLsJRKZgg": {
    "XKTZ0xJFtAZ2": {}, // 獨處時非常穩定
    "qu1cStPZlYis": { 情緒: 0.5 }, // 偶爾不安
    "oY9zLeFNFGTo": { 情緒: 1 } // 獨處常焦躁、出現異常行為
  },
  // 4r6iyfQo5UYK: 寶貝是否對新環境、搬家或陌生空間容易緊張、不安或不願探索？
  "4r6iyfQo5UYK": {
    "XmfzkhctLs6k": {}, // 非常適應環境，情緒穩定
    "6bag6wd3RUdh": { 情緒: 0.5 }, // 適應力普通，有些焦躁
    "8GCWYZNBwcvj": { 情緒: 1 } // 常緊張、戒備心強、不易放鬆
  },
  // J9vSx76ASdKP: 寶貝是否對聲音特別敏感？
  "J9vSx76ASdKP": {
    "jaebiZl9jPga": {}, // 非常鎮定、不怕聲音
    "ygxL2O37T3Tl": { 情緒: 0.5 }, // 偶爾受驚但可平復
    "5kuZpDbf2qwr": { 情緒: 1 } // 對聲音非常敏感、情緒激動
  },
  // W9tDwUbMLPzN: 寶貝的體型是否已影響日常活動？
  "W9tDwUbMLPzN": {
    "AXYsiBEfLAjB": {}, // 無影響
    "HdyCTYpt0Ar1": { 體重: 0.5 }, // 輕微影響
    "zJn2sBivn8Gj": { 體重: 1 } // 明顯影響日常行為
  },
  // lHfNIJcjtG2n: 寶貝的食慾是否異常（暴食、挑食或食量變化大）？
  "lHfNIJcjtG2n": {
    "9tqr0aTD5LGc": {}, // 食慾穩定
    "ibjxpvyQKa7g": { 腸胃: 0.5 }, // 偶爾暴食或挑食
    "ktV32pcNCtCI": { 腸胃: 1 } // 常有食慾異常或進食行為怪異
  },
  // 33Bpbj6NvPG6: 寶貝的體重變化是否穩定？
  "33Bpbj6NvPG6": {
    "YTpO4KVllmG7": {}, // 體重穩定
    "7lCAQaXkurvC": { 體重: 0.5 }, // 偶爾有輕微變化
    "eo3ikHjcqfPj": { 體重: 1 } // 經常波動大
  },
  // Z8dsIrgYXAzH: 寶貝是否在日常生活中變得不愛活動？
  "Z8dsIrgYXAzH": {
    "E6o9n6OXUTYH": {}, // 平常活動力正常
    "LySivMb8i5my": { 關節: 0.5 }, // 偶爾會顯得懶洋洋，但持續時間不長
    "T0b0fxVSKGlb": { 關節: 1 } // 經常懶洋洋，幾乎不主動活動
  },
  // 1TVDYuk0jGar: 寶貝在短時間運動後是否表現出疲憊或呼吸急促？
  "1TVDYuk0jGar": {
    "5TjioH6UvZrU": {}, // 運動後恢復快，幾乎沒有疲憊表現
    "sVUJmaXYtXlC": { 心血管: 0.5 }, // 偶爾感覺較疲憊，但可以很快恢復
    "gaMxOnwLbapp": { 心血管: 1 } // 經常運動後喘息明顯，需要長時間休息
  },
  // 3rdB1Dc8C2Mb: 寶貝是否曾有喘息、咳嗽或夜間呼吸不規律的情況？
  "3rdB1Dc8C2Mb": {
    "huW9CckamUPt": { 心血管: 1 }, // 沒有出現過
    "YeTNYgEq6OAk": { 心血管: 1 }, // 偶爾有，但時間短
    "oSgXk4nhDl7c": { 心血管: 2 } // 經常出現且持續時間長
  },
  // cV6GYtzBETmh: 寶貝是否經常眨眼或揉眼睛？
  "cV6GYtzBETmh": {
    "fpZeYIgom3RO": {}, // 很少或沒有
    "6sQgbWtx51xI": { 眼睛: 0.5 }, // 偶爾出現
    "8FUVuMPzATEh": { 眼睛: 1 } // 經常出現
  },
  // NA30VERyt14J: 寶貝是否在強光下顯得不適，或在低光環境下行動異常？
  "NA30VERyt14J": {
    "4admwK5yWzqk": {}, // 完全正常
    "JP59l3BPB4Bi": { 眼睛: 0.5 }, // 偶爾有不適反應
    "TiBoFbwBVdjW": { 眼睛: 1 } // 經常表現出不適
  },
  // GVvU76rBGIYd: 是否發現眼睛分泌物增加、眼白變紅或眼睛混濁的情況？
  "GVvU76rBGIYd": {
    "Ln3qGBJV46Dg": { 眼睛: 1 }, // 沒有異常
    "epXjoP8LuE0t": { 眼睛: 1 }, // 偶爾出現異常
    "hemQrpFULCJz": { 眼睛: 2 } // 經常有明顯異常
  },
  // TstMewOzQrWZ: 寶貝是否容易生病、反覆感染或體質虛弱？
  "TstMewOzQrWZ": {
    "6PDC598Fz1cH": { 免疫: 0.5 }, // 幾乎不生病
    "i9j5VNmz5VKs": { 免疫: 1 }, // 偶爾小病，但恢復迅速
    "eMxruFyCUWFk": { 免疫: 2 } // 經常生病且恢復較慢
  },
  // 9kMQcoK7eVO4: 寶貝是否容易出現過敏反應（如皮膚紅疹、打噴嚏、流鼻水）？
  "9kMQcoK7eVO4": {
    "NMPWWpDZ7hll": { 免疫: 1 }, // 沒有明顯過敏症狀
    "o31smP59VbDG": { 免疫: 1 }, // 偶爾有輕微過敏
    "DEBxjToOwECh": { 免疫: 2 } // 經常出現明顯過敏反應
  },
  // HFkk2DCJqMXK: 寶貝是否曾出現過長時間恢復的疾病症狀，或是否對普通感染恢復較慢？
  "HFkk2DCJqMXK": {
    "c4NS2It2jp8V": { 免疫: 1 }, // 沒有這樣的情況
    "SEmQxBiAsxU0": { 免疫: 1 }, // 偶爾恢復較慢，但影響不大
    "bYQrSiDNsgE0": { 免疫: 2 } // 經常恢復緩慢，並影響日常活動
  },
  // oiciZoATwsUl: 為了讓我們的 AI 系統提供更安全且貼近寶貝需求的保健建議，請勾選寶貝是否已有已知的疾病。
  "oiciZoATwsUl": {
    "2ks2BzjYFd1J": {}, // 無
    "txMU23sM6MXn": { 腸胃: 1 }, // 腸胃道問題（如慢性腸胃炎、胰臟炎）
    "yJkzt6cN8YoZ": { 關節: 1, 體重: 0.5 }, // 關節疾病（如關節炎、退化性關節病）
    "PUgoUzxxEgJn": { 泌尿: 1, 體重: 0.5, 免疫: 0.5 }, // 慢性泌尿問題（如腎臟病、尿道結石）
    "XXPDvKXuLDXC": { 皮毛: 1, 免疫: 0.5 }, // 慢性皮膚病（如異位性皮膚炎）
    "aoLonmGG9qf1": { 情緒: 1 }, // 長期焦慮或情緒障礙（獸醫診斷）
    "tLO7Dwj1qfou": { 體重: 1, 關節: 0.5 }, // 體重代謝問題（如肥胖、糖尿病）
    "YuRt8kH7yN2W": { 心血管: 1, 體重: 0.5, 免疫: 0.5 }, // 心血管問題（如心雜音、心臟病）
    "iVVxPR18qae1": { 眼睛: 1 }, // 視力退化／眼疾（如白內障）
    "njDRrWCFhhUx": { 免疫: 0.5, 體重: 0.5 }, // 免疫相關問題（如氣喘、易感染體質）
    "iZdy3ZvT0vc0": {} // 其他
  },
  // uPYaYmDniYXi: 若寶貝曾經歷過手術或有特殊健康狀況，我們的 AI 系統將會嘗試標示為高關懷對象，並在未來進一步進行健康分析與提供建議。
  "uPYaYmDniYXi": {
    "EkL37uUb4ULA": {}, // 無
    "GpIS5vjtPswt": { 腸胃: 1 }, // 曾進行腸胃手術（如腸阻塞、胃扭轉等）
    "UxL1ktzLQbre": { 關節: 1 }, // 曾進行關節手術（如髖關節、十字韌帶重建等）
    "Lwyy3ZPCMElq": { 泌尿: 1 }, // 曾進行泌尿道手術（如膀胱結石、尿道阻塞等）
    "zOeRNZkx3fF0": { 皮毛: 1 }, // 曾因皮膚腫瘤／皮膚病接受開刀
    "xF39hPV1b0jK": { 情緒: 1 }, // 曾因行為或神經問題接受相關處置（如焦慮治療、癲癇控制等）
    "HnWjsaWQ67Iu": { 體重: 1 }, // 曾因肥胖引發的相關併發手術（如膝關節矯正、脂肪瘤切除）
    "dWdUmSTHD6tG": { 心血管: 1 }, // 曾接受心臟相關手術（如心導管、心臟瓣膜等）
    "OBRuPCgr1OI8": { 眼睛: 1 }, // 曾因眼疾進行眼科手術（如白內障、視網膜修補等）
    "MmV63Z3FsiBP": { 免疫: 1 }, // 曾因免疫問題接受特殊處理（如自體免疫疾病、腫瘤切除、免疫抑制治療）
    "6s9VDgizko7G": {} // 其他（不影響配方建議，僅供紀錄）
  }
};

// 九大項分類
const healthCategories = [
  '腸胃', '關節', '泌尿', '皮毛', '情緒', '體重', '心血管', '眼睛', '免疫'
];

// 計算分數的函數
function calculateScores(answers) {
  const scores = {
    腸胃: 0,
    關節: 0,
    泌尿: 0,
    皮毛: 0,
    情緒: 0,
    體重: 0,
    心血管: 0,
    眼睛: 0,
    免疫: 0
  };

  // 遍歷每個答案
  answers.forEach(answer => {
    const questionId = answer.field?.id;
    let answerIds = [];

    // 根據答案類型獲取答案ID
    if (answer.type === 'choice' && answer.choice?.id) {
      // 單選答案
      answerIds = [answer.choice.id];
    } else if (answer.type === 'choices' && answer.choices?.ids) {
      // 多選答案 - 使用choices.ids陣列
      answerIds = answer.choices.ids;
    } else if (answer.type === 'text' && answer.text) {
      // 對於text類型的答案，可能需要特殊處理
      // 這裡先跳過，因為暫存資料主要針對choice類型
      return;
    }

    // 處理每個答案ID
    answerIds.forEach(answerId => {
      // 如果找到對應的權重資料
      if (questionId && answerId && answerWeights[questionId] && answerWeights[questionId][answerId]) {
        const weights = answerWeights[questionId][answerId];
        
        // 累加各項分數
        Object.keys(weights).forEach(category => {
          if (scores.hasOwnProperty(category)) {
            scores[category] += weights[category];
          }
        });
      }
    });
  });

  return scores;
}

// 獲取最高分數的項目
function getTopCategories(scores, limit = 3) {
  return Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([category, score]) => ({ category, score }));
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request, { params }) {
  try {
    console.log('params', params);
    const { responseId } = await params;
    console.log('responseId', responseId);
    if (!responseId) {
      return new Response(JSON.stringify({ error: '缺少 responseId 參數' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 調用 Typeform API 獲取問卷資料
    const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
    const FORM_ID = process.env.FORM_ID;

    if (!TYPEFORM_TOKEN || !FORM_ID) {
      return new Response(JSON.stringify({ error: '缺少必要的環境變數' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const res = await fetch(
      `https://api.typeform.com/forms/${FORM_ID}/responses?included_response_ids=${responseId}`,
      {
        headers: {
          Authorization: `Bearer ${TYPEFORM_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: '無法獲取 Typeform 資料' }), {
        status: res.status,
        headers: corsHeaders,
      });
    }

    const typeformData = await res.json();
    console.log('typeformData', typeformData);
    // 過濾出 responseId 完全符合的那一筆
    const matched = (typeformData.items || []).find(item => 
      item.response_id === responseId
    );

    if (!matched) {
      return new Response(JSON.stringify({ 
        error: '找不到對應的問卷資料',
        responseId: responseId 
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // 提取答案資料
    const answers = matched.answers || [];

    // 計算分數
    const scores = calculateScores(answers);
    const topCategories = getTopCategories(scores);

    // 返回結果
    const result = {
      success: true,
      responseId: responseId,
      scores: scores,
      top_categories: topCategories,
      total_questions_processed: answers.length,
      message: '分數計算完成',
      raw_data: {
        response_id: matched.response_id,
        submitted_at: matched.submitted_at,
        answers_count: answers.length
      }
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('分數計算API錯誤:', error);
    return new Response(JSON.stringify({ 
      error: '分數計算失敗', 
      details: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
