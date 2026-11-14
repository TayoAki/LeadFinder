"""Build mock catalogue (products + fictional indie shops) from DummyJSON for the prototype."""
import json, urllib.request, random
random.seed(7)
import sys
src = json.load(open(sys.argv[1]))["products"]
keep = {'home-decoration':'Home','kitchen-accessories':'Home','furniture':'Home','tops':'Women','womens-dresses':'Women','womens-bags':'Bags','womens-jewellery':'Jewelry',
        'mens-shirts':'Men','sunglasses':'Accessories','skin-care':'Beauty','beauty':'Beauty','mens-shoes':'Shoes','womens-shoes':'Shoes','womens-watches':'Accessories','sports-accessories':'Outdoors'}
shops = [
 ("s1","Juniper Home","Furniture and decor, made to order","Home",["furniture","home-decoration"]),
 ("s2","Saltwater Studio","Small-batch beauty from San Diego","Beauty",["beauty","skin-care"]),
 ("s3","Northbound Sport","Gear for weekend games","Outdoors",["sports-accessories"]),
 ("s4","Marigold Thread","Slow-fashion dresses and tops","Women",["tops","womens-dresses"]),
 ("s5","Kettle & Co.","Kitchen tools that last a lifetime","Home",["kitchen-accessories"]),
 ("s6","Dune Leather","Bags cut and stitched in Austin","Bags",["womens-bags"]),
 ("s7","Little Orbit","Everyday jewelry, nickel-free","Jewelry",["womens-jewellery"]),
 ("s8","Field Day Shoes","Comfort shoes for long days","Shoes",["mens-shoes","womens-shoes"]),
 ("s9","Harbor Shirt Co.","Shirts made to be worn in","Men",["mens-shirts"]),
 ("s10","Sunny Side Optics","Sunglasses and watches with a wink","Accessories",["sunglasses","womens-watches"]),
]
BRANDS = ["annibale","knoll","olay","vaseline","essence","attitude","gucci","rolex","nike","puma","calvin","dior","chanel","apple","samsung","iphone","dolce","prada","louis","adidas","tag heuer","iwc","longines","fossil","heshe","gigabyte","asus","lenovo","huawei","oppo","realme","vivo","amazon","sony","jbl","beats","marni","versace","burberry","givenchy","hermes","bvlgari","cartier","off white"]
shopFor = {c: sid for sid,_,_,_,cs in shops for c in cs}
prods = []
for p in src:
    c = keep.get(p["category"])
    if not c or any(b in p["title"].lower() for b in BRANDS): continue
    shop = shopFor[p["category"]]
    sizes = ["XS","S","M","L","XL"] if c in ("Women","Men") else (["6","7","8","9","10","11"] if c=="Shoes" else [])
    prods.append({"id":str(p["id"]),"title":p["title"],"price":round(p["price"],2),"compareAt": round(p["price"]*1.25,2) if random.random()<0.3 else None,
      "category":c,"shopId":shop,"image":p["thumbnail"],"images":p["images"][:4] or [p["thumbnail"]],"rating":round(max(3.8,p["rating"]),1),
      "reviews":random.randint(4,480),"stock":random.choice([2,3,5,8,12,25,40,99]),"sold":random.randint(5,900),"sizes":sizes,"description":p["description"]})
for s in shops: assert any(p["shopId"]==s[0] for p in prods), s
out = {"shops":[{"id":i,"name":n,"tagline":t,"category":c,"followers":random.randint(300,24000),"rating":round(random.uniform(4.5,5.0),1),
        "logo": next(p["image"] for p in prods if p["shopId"]==i), "banner": next(p["images"][-1] for p in prods if p["shopId"]==i),
        "shipsIn":random.choice(["1–2 days","2–3 days","Same day"]),"freeOver":random.choice([35,50,60]),"shipping":random.choice([4.99,5.95,6.5])} for i,n,t,c,_ in shops],
       "products":prods}
json.dump(out, open("src/data/catalog.json","w"), indent=1)
print(len(prods),"products", {s[0]:sum(p['shopId']==s[0] for p in prods) for s in shops})
