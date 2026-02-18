import json
import random
r=random.Random(42)
dims=["Climate","Cost","Safety","Mobility","Career","Culture","Nature","International"]
cities=[]
for i in range(150):
 s=[round(r.uniform(0.3,0.9),2) for _ in range(8)]
 cities.append({"city_id":f"C{i:03d}","city_name":f"City{i}","country_name":"Country","region":"Asia","lat":r.uniform(-60,60),"lon":r.uniform(-180,180),"dimension_scores":dict(zip(dims,s)),"tags":["Tag1","Tag2"],"known_tradeoffs":["Risk1"],"confidence":"Medium"})
out={"version":"v1","generated_at":"2026-02-18","cities":cities}
json.dump(out,open("public/data/cities.lite.v1.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)
print(f"Generated {len(cities)} cities")
